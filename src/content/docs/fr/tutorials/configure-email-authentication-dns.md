---
title: Configurer le DNS d'authentification des e-mails
description:
  Publiez et vérifiez des enregistrements DKIM et DMARC dédiés dans une zone DNS ZCP existante.
sidebar:
  label: Configurer le DNS d'authentification des e-mails
---

Les enregistrements DNS d'authentification des e-mails aident les systèmes de réception à distinguer
les messages envoyés par vos systèmes autorisés de ceux qui prétendent seulement utiliser votre
domaine. Ce tutoriel configure des ensembles d'enregistrements DKIM et DMARC dédiés dans une zone
DNS ZCP existante. Il explique aussi comment gérer SPF de façon sûre.

Choisissez un seul responsable pour chaque ensemble d'enregistrements : le CLI `zcp` ou
Terraform/OpenTofu. N'utilisez pas les deux outils pour gérer le même nom et le même type. Le CLI
accepte une valeur de contenu à chaque création et supprime les enregistrements selon leur nom et
leur type complets. Terraform modélise les enregistrements comme des ensembles nommés et typés.

À la fin, vous aurez :

- Un inventaire de la zone DNS et des systèmes autorisés à envoyer des e-mails
- Un enregistrement DKIM ou CNAME publié au sélecteur fourni par le prestataire
- Un enregistrement DMARC en mode surveillance, dont les rapports sont envoyés à une boîte que vous
  contrôlez
- Une routine de vérification du DNS et des e-mails authentifiés de chaque expéditeur

Ce guide suppose que ZCP héberge déjà la zone faisant autorité. Pour créer une zone et la déléguer
chez votre registraire, suivez
[Héberger un domaine sur ZCP (CLI)](/fr/tutorials/host-dns-on-zcp-cli/).

:::caution

Les enregistrements DNS ne constituent qu'une partie de la sécurité des e-mails. Publier un
enregistrement DKIM n'active pas la signature dans le système émetteur, et publier DMARC ne prouve
pas que chaque expéditeur le réussit. Testez les e-mails reçus après chaque modification.

:::

## Avant de commencer

Vous avez besoin de :

- Une zone DNS ZCP pour un domaine que vous contrôlez
- Le [CLI `zcp`](/fr/public-cloud/cli/installation) authentifié avec un jeton, ou Terraform ou
  OpenTofu avec `ZCP_BEARER_TOKEN` défini dans votre shell
- L'accès à chaque système qui envoie des e-mails avec le domaine, notamment les livraisons
  d'applications, notifications, assistance, facturation, marketing et alertes d'appareils ou de
  services
- Une boîte aux lettres réservée aux rapports agrégés DMARC, par exemple `dmarc-reports@example.ca`
- Les instructions DKIM et SPF exactes de chaque système émetteur

Les noms `example.ca` de ce guide sont des espaces réservés. Remplacez-les par un domaine que vous
contrôlez. Ne collez jamais de clé DKIM privée dans DNS. DNS publie seulement une clé publique ou
une cible CNAME fournie par le prestataire.

## Inventorier la zone et les expéditeurs

Commencez par enregistrer l'état actuel. Conservez la sortie dans votre suivi de changement. Elle
vous donne le slug de zone, les serveurs de noms et les ensembles d'enregistrements à préserver.

```bash
zcp dns list
zcp dns show <domain-slug> --output json
```

Interrogez les deux serveurs de noms ZCP faisant autorité pour les enregistrements concernés.
Remplacez `example.ca` par votre domaine.

```bash
for ns in ns1.zsoftly.ca ns2.zsoftly.ca; do
  dig TXT example.ca "@$ns" +short
  dig TXT _dmarc.example.ca "@$ns" +short
  dig TXT selector._domainkey.example.ca "@$ns" +short
  dig CNAME selector._domainkey.example.ca "@$ns" +short
done
```

Répertoriez chaque expéditeur légitime, le domaine utilisé dans l'adresse From visible, le domaine
d'expéditeur d'enveloppe et son sélecteur DKIM ou ses instructions CNAME. Incluez les systèmes qui
n'envoient qu'occasionnellement. Désignez un responsable qui approuve les changements et examine les
rapports DMARC. Conservez cet inventaire avec les valeurs d'enregistrement et la date du dernier
test.

:::caution

Ne supprimez pas un ensemble `TXT` racine (`@`) existant pour ajouter SPF lorsque l'apex de zone est
le domaine d'expéditeur d'enveloppe. Il peut contenir des valeurs de vérification sans rapport.
N'ajoutez pas de deuxième politique SPF à un domaine d'expéditeur. SPF n'autorise qu'une politique
et limite à 10 les recherches DNS. Les chaînes `include` non examinées sont donc risquées. Utilisez
la valeur complète fournie par les systèmes autorisés, puis validez-la avant de modifier le courrier
actif.

:::

Le CLI ZCP actuel crée ou supprime un ensemble d'enregistrements complet, défini par nom et type. Il
ne dispose pas de commande de mise à jour sur place. Le fournisseur Terraform actuel remplace aussi
un `zcp_dns_record` lorsque son contenu, nom, type ou TTL change. Pour un SPF existant ou un autre
ensemble `TXT` à plusieurs valeurs, utilisez le processus DNS établi qui préserve l'ensemble
complet. Ne créez pas une seconde ressource `TXT` racine et ne supprimez pas puis recréez pendant
une livraison normale.

## Comprendre les noms d'enregistrement

SPF, DKIM et DMARC utilisent des noms DNS différents et répondent à des questions distinctes.

- **SPF** est une politique `TXT` au domaine de l'expéditeur d'enveloppe. Quand ce domaine est
  l'apex de la zone, le nom d'enregistrement est `@`. Il peut aussi être un sous-domaine, comme
  `bounce.example.ca`. Conservez une politique unique et complète, et tenez compte des recherches
  DNS dans toutes les inclusions autorisées.
- **DKIM** est un enregistrement `TXT` ou `CNAME` à `<selector>._domainkey.example.ca`. Il permet
  aux destinataires de récupérer les éléments publics nécessaires pour valider une signature de
  message.
- **DMARC** est un enregistrement `TXT` à `_dmarc.example.ca`. Il indique aux destinataires la
  politique à appliquer quand le domaine From visible n'a pas d'e-mails authentifiés et alignés, et
  demande des rapports.

Le système destinataire a besoin de SPF ou de DKIM pour authentifier et aligner l'e-mail avec le
domaine From visible afin que DMARC réussisse. La configuration DNS seule ne suffit pas. Configurez
chaque système expéditeur avec le bon domaine, activez sa signature DKIM et envoyez un message de
test après la publication.

Pour la norme sur la sélection des enregistrements SPF et les limites de recherche, consultez
[RFC 7208](https://www.rfc-editor.org/info/rfc7208).

## Choisir une méthode de gestion

Utilisez le CLI pour une petite modification examinée sur un nom d'enregistrement dédié et
inutilisé. Utilisez Terraform ou OpenTofu quand votre équipe gère déjà cette zone comme du code et
examine les plans. Les exemples ci-dessous créent uniquement les ensembles d'enregistrements DKIM et
DMARC dédiés après confirmation que chaque nom est absent.

N'appliquez pas les commandes CLI si Terraform ou OpenTofu possède le même ensemble
d'enregistrements. N'appliquez pas la configuration Terraform si une personne modifie le même
ensemble par le CLI ou la console. Consignez le responsable avec votre inventaire des expéditeurs.

Si l'apex de la zone est le domaine de l'expéditeur d'enveloppe et qu'il n'a aucun ensemble
d'enregistrements `TXT`, utilisez une seule méthode de gestion pour créer une politique SPF unique
avec la valeur complète fournie par tous les expéditeurs autorisés. Faites-le seulement après avoir
vérifié chaque expéditeur et les recherches DNS de cette valeur. Un domaine d'envoi actif avec un
ensemble `TXT` racine existant exige un changement distinct et examiné, car ce tutoriel ne peut pas
fusionner ni mettre à jour cet ensemble partagé de façon sûre.

## Publier DKIM et DMARC avec le CLI

Définissez les variables de votre zone et les instructions fournies par un système expéditeur. La
valeur DKIM ci-dessous est lue depuis votre terminal pour éviter son inscription dans l'historique
du shell. Saisissez la présentation DNS complète : une chaîne entre guillemets pour une courte
valeur TXT, ou la présentation complète, entre guillemets et découpée, du prestataire pour une
longue clé. Saisissez la cible CNAME exacte quand l'expéditeur demande un CNAME.

```bash
export DOMAIN_SLUG="exampleca"
export DOMAIN_NAME="example.ca"
export DKIM_SELECTOR="mailer1"
read -r DKIM_CONTENT
```

Confirmez que le nom du sélecteur et `_dmarc` ne possèdent pas déjà un ensemble d'enregistrements.
Interrogez les véritables serveurs de noms faisant autorité affichés par
`zcp dns show <domain-slug>`. Exigez une réponse faisant autorité réussie de la part des deux
serveurs. Un délai d'attente, une réponse `SERVFAIL` ou `REFUSED` ne donne pas l'autorisation de
créer un enregistrement.

```bash
for ns in ns1.zsoftly.ca ns2.zsoftly.ca; do
  dig TXT "$DKIM_SELECTOR._domainkey.$DOMAIN_NAME" "@$ns" +norecurse +noall +comments +answer
  dig CNAME "$DKIM_SELECTOR._domainkey.$DOMAIN_NAME" "@$ns" +norecurse +noall +comments +answer
  dig TXT "_dmarc.$DOMAIN_NAME" "@$ns" +norecurse +noall +comments +answer
done
```

Remplacez les valeurs d'exemple `ns1.zsoftly.ca` et `ns2.zsoftly.ca` par les serveurs faisant
autorité indiqués pour votre zone. Si une section de réponse contient un enregistrement,
arrêtez-vous et examinez son responsable actuel.

Créez l'enregistrement DKIM `TXT` uniquement lorsque l'expéditeur a fourni une valeur TXT. ZCP
ajoute la zone au nom relatif. Utilisez donc `mailer1._domainkey`, et non le nom de domaine complet.

```bash
zcp dns record-create \
  --domain "$DOMAIN_SLUG" \
  --name "$DKIM_SELECTOR._domainkey" \
  --type TXT \
  --content "$DKIM_CONTENT" \
  --ttl 3600
```

Si le système expéditeur a plutôt fourni un CNAME, créez un CNAME avec sa cible exacte et ne créez
pas l'enregistrement TXT.

```bash
zcp dns record-create \
  --domain "$DOMAIN_SLUG" \
  --name "$DKIM_SELECTOR._domainkey" \
  --type CNAME \
  --content "<provider-issued-target>." \
  --ttl 3600
```

Créez d'abord DMARC en mode surveillance. La boîte de réception des rapports doit exister et son
responsable doit examiner les rapports.

```bash
zcp dns record-create \
  --domain "$DOMAIN_SLUG" \
  --name _dmarc \
  --type TXT \
  --content '"v=DMARC1; p=none; rua=mailto:dmarc-reports@example.ca"' \
  --ttl 3600
```

Si, et seulement si, les requêtes faisant autorité confirment qu'il n'existe pas d'ensemble
d'enregistrements `TXT` racine, vous pouvez publier l'unique politique SPF complète fournie par tous
les expéditeurs autorisés. Saisissez sa présentation DNS complète à l'invite. N'utilisez pas
`v=spf1 -all` pour un domaine d'envoi actif, sauf si aucun système n'est autorisé à envoyer avec
lui.

```bash
dig TXT "$DOMAIN_NAME" @ns1.zsoftly.ca +norecurse +noall +comments +answer
dig TXT "$DOMAIN_NAME" @ns2.zsoftly.ca +norecurse +noall +comments +answer
read -r SPF_CONTENT

zcp dns record-create \
  --domain "$DOMAIN_SLUG" \
  --name @ \
  --type TXT \
  --content "$SPF_CONTENT" \
  --ttl 3600
```

Les données `TXT` doivent parvenir au DNS comme des chaînes de caractères entre guillemets. La page
de configuration d'un expéditeur peut afficher une valeur non entre guillemets à copier-coller. Dans
ce cas, obtenez sa présentation DNS avant de créer l'enregistrement. Une chaîne unique exige des
guillemets. Une valeur longue peut exiger des segments entre guillemets de 255 octets au plus, que
les résolveurs concatènent en une valeur TXT. Conservez intacts les segments fournis par le
prestataire. Ne divisez pas une clé publique dans des enregistrements DNS distincts et n'inventez
pas de clé. Vérifiez la réponse publiée par rapport aux instructions de l'expéditeur avant d'activer
la signature.

## Publier DKIM et DMARC avec Terraform ou OpenTofu

Utilisez cette méthode uniquement lorsque l’infrastructure sous forme de code gère les
enregistrements dédiés. Définissez le jeton dans votre shell. Ne le placez pas dans `main.tf` et ne
le validez pas.

```bash
export ZCP_BEARER_TOKEN="<your-token>"
```

Créez `main.tf`. Cette configuration référence une zone existante par son slug. Elle ne déclare pas
la zone elle-même, afin qu’une application ne puisse pas la remplacer.

```hcl
terraform {
  required_providers {
    zcp = {
      source  = "zsoftly/zcp"
      version = "~> 0.2.0"
    }
  }
}

variable "domain_slug" {
  type = string
}

variable "dkim_selector" {
  type = string
}

variable "dkim_txt_content" {
  type = string
}

provider "zcp" {}

resource "zcp_dns_record" "dkim" {
  domain  = var.domain_slug
  name    = "${var.dkim_selector}._domainkey"
  type    = "TXT"
  content = var.dkim_txt_content
  ttl     = 3600

  lifecycle {
    prevent_destroy = true
  }
}

resource "zcp_dns_record" "dmarc" {
  domain  = var.domain_slug
  name    = "_dmarc"
  type    = "TXT"
  content = "\"v=DMARC1; p=none; rua=mailto:dmarc-reports@example.ca\""
  ttl     = 3600

  lifecycle {
    prevent_destroy = true
  }
}
```

Si l'ensemble d'enregistrements `TXT` racine est absent, vous pouvez ajouter cette troisième
ressource après avoir validé la politique complète auprès de chaque expéditeur autorisé. Ne
l'ajoutez pas à une configuration d'ensemble `TXT` racine déjà existant.

```hcl
variable "spf_txt_content" {
  type = string
}

resource "zcp_dns_record" "spf" {
  domain  = var.domain_slug
  name    = "@"
  type    = "TXT"
  content = var.spf_txt_content
  ttl     = 3600

  lifecycle {
    prevent_destroy = true
  }
}
```

Si l'expéditeur a fourni un sélecteur CNAME, remplacez à la fois la variable `dkim_txt_content` et
la ressource `zcp_dns_record.dkim` ci-dessus par la variable et la ressource suivantes. Ne déclarez
pas les deux ressources DKIM avec le même nom de sélecteur.

```hcl
variable "dkim_cname_target" {
  type = string
}

resource "zcp_dns_record" "dkim_cname" {
  domain  = var.domain_slug
  name    = "${var.dkim_selector}._domainkey"
  type    = "CNAME"
  content = var.dkim_cname_target
  ttl     = 3600

  lifecycle {
    prevent_destroy = true
  }
}
```

Définissez `dkim_cname_target` avec le nom d'hôte complet fourni par le prestataire et un point
final, par exemple `selector.provider.example.ca.`. Une cible sans point final peut être considérée
comme relative à votre zone.

Conservez les valeurs des variables avec votre configuration DNS. Une valeur DKIM TXT contient une
clé publique. Une valeur DKIM CNAME contient une cible DNS fournie par le prestataire. Gardez le
jeton Bearer dans l'environnement et hors du contrôle de code source.

```bash
terraform init
terraform plan -var='domain_slug=exampleca' -var='dkim_selector=mailer1'
terraform apply -var='domain_slug=exampleca' -var='dkim_selector=mailer1'
```

OpenTofu utilise la même configuration et les mêmes sous-commandes avec `tofu` à la place de
`terraform`. Lisez le plan avant de l'approuver. Un `zcp_dns_record` représente l'ensemble complet
identifié par `domain`, `name` et `type`. Son contenu est accessible en écriture seulement. Le
fournisseur ne détecte donc pas les changements de contenu hors bande. Un changement de
configuration force le remplacement. La protection `prevent_destroy` bloque une suppression
planifiée tant que le bloc de ressource reste dans la configuration. Supprimer ce bloc supprime
aussi la protection. Ce n'est donc pas une méthode de restauration. Lisez chaque plan. Retirez la
protection seulement lors d'une modification de maintenance approuvée, après examen du plan de
remplacement et de restauration.

:::caution

N'utilisez pas `create_before_destroy` pour un ensemble d'enregistrements DNS. Le même nom et le
même type identifient l'ensemble complet, et supprimer l'ancienne ressource peut supprimer les
nouvelles données. N'ajoutez pas de `zcp_dns_record` pour un enregistrement SPF racine actif ou un
ensemble `TXT` à plusieurs valeurs existant. Le champ scalaire `content` du fournisseur ne permet
pas de fusionner de façon sûre des valeurs gérées ailleurs.

:::

Pour placer un ensemble d'enregistrements DKIM TXT dédié existant sous Terraform, configurez la
ressource `zcp_dns_record.dkim` ci-dessus pour correspondre à ses valeurs actuelles, puis
importez-la :

```bash
terraform import zcp_dns_record.dkim exampleca/TXT/mailer1._domainkey
```

Le format d'importation d'enregistrement est `<domain-slug>/<type>/<relative-name>`. Le fournisseur
ne peut pas relire le contenu dans une forme comparable. L'importation initialise donc seulement
l'identité. Exécutez `terraform plan` après l'importation et n'approuvez pas le remplacement d'un
ensemble d'enregistrements actif avant d'avoir confirmé la valeur complète planifiée et le plan de
restauration.

## Vérifier le DNS et les e-mails reçus

Interrogez d'abord les deux serveurs faisant autorité. Obtenez leurs noms pour votre zone avec
`zcp dns show <domain-slug>`. Les noms ci-dessous sont des exemples. Interrogez ensuite un résolveur
récursif public après la délégation et l'actualisation des caches.

```bash
for ns in ns1.zsoftly.ca ns2.zsoftly.ca; do
  dig TXT mailer1._domainkey.example.ca "@$ns" +short
  dig TXT _dmarc.example.ca "@$ns" +short
done

dig TXT mailer1._domainkey.example.ca @1.1.1.1 +short
dig TXT _dmarc.example.ca @1.1.1.1 +short
```

Pour un sélecteur basé sur CNAME, remplacez la première requête `TXT` par `CNAME`. Comparez la
réponse aux instructions exactes du système expéditeur. Une recherche DNS réussie ne prouve pas que
l'expéditeur signe les messages. Ce n'est donc que la première vérification.

Envoyez un message de chaque source légitime vers une boîte de test que vous contrôlez. Examinez les
en-têtes du message reçu par un destinataire fiable. Son en-tête `Authentication-Results` doit
afficher les résultats d'authentification du message. Confirmez que le domaine From visible s'aligne
avec un résultat SPF ou DKIM réussi. Testez les réponses, avis d'application, messages transférés et
toute voie d'envoi qui utilise un expéditeur d'enveloppe ou un sélecteur différent.

## Faire passer DMARC de la surveillance à l'application

Commencez avec `p=none` et recueillez les rapports. Rapprochez chaque source de rapport de votre
inventaire d'expéditeurs. Corrigez les signatures DKIM absentes, les autorisations SPF manquantes ou
l'alignement de domaine avant de modifier la politique.

Lorsque les rapports et les tests de livraison montrent que le trafic légitime s'authentifie
correctement, passez à `p=quarantine`. Continuez l'examen durant ce changement. Passez à `p=reject`
seulement lorsque les échecs restants sont compris et acceptés. Les messages signés peuvent être
transférés ou modifiés par des systèmes intermédiaires. Incluez donc ces chemins dans votre examen
avant de resserrer la politique.

Utilisez la même méthode de gestion qui possède `_dmarc` pour chaque changement. Avec le CLI,
consignez le contenu précédent de l'enregistrement avant la modification de maintenance approuvée,
puis restaurez exactement ce contenu si les tests de livraison échouent. Avec Terraform ou OpenTofu,
conservez la configuration précédente examinée et utilisez un plan examiné pour y revenir.
N'exécutez pas de `destroy` global pour des changements DNS.

## Intégrer le DNS à votre programme de sécurité des e-mails

Examinez régulièrement les rapports DMARC, l'inventaire des expéditeurs, les changements DNS et les
preuves de test. Soumettez les nouveaux systèmes à un examen d'expéditeur avant qu'ils utilisent
votre domaine. Retirez les expéditeurs abandonnés de SPF et désactivez les sélecteurs DKIM et
configurations de signature inutilisés lorsque les files d'attente d'e-mails et les besoins de
vérification sont connus.

Le DNS ne remplace pas les contrôles hors DNS :

- Exigez l'authentification multifacteur pour l'accès administrateur et DNS.
- Appliquez le moindre privilège et examinez l'accès de récupération, le transfert, la délégation et
  le départ des utilisateurs.
- Ajustez le filtrage entrant et les contrôles d'usurpation, puis examinez les résultats de
  quarantaine et réduisez les exceptions.
- Examinez l'appartenance aux groupes externes et les paramètres de partage de données.
- Traitez les certificats de chiffrement des messages et les fonctions d'e-mails connectées à l'IA
  comme des décisions distinctes sur les destinataires, la récupération de clés, l'accès aux données
  et le coût.

Pour les décisions de politique et de responsabilité qui sous-tendent ce travail technique, lisez
[La sécurité des e-mails a besoin d'un responsable](https://zcp.zsoftly.ca/blog/email-security-needs-an-owner).

## Prochaines étapes

- [Héberger un domaine sur ZCP (CLI)](/fr/tutorials/host-dns-on-zcp-cli/) pour créer et déléguer une
  zone.
- [Gérer le DNS avec le CLI](/fr/public-cloud/dns/cli) pour les commandes DNS prises en charge.
- [Enregistrements TXT](/fr/public-cloud/dns/records/txt) pour les exemples de guillemets et de
  recherche directe.
- [Dépannage DNS](/fr/public-cloud/dns/troubleshooting) pour les vérifications DNS faisant autorité
  et récursives.

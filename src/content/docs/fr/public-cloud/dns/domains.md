---
title: Domaines
description:
  Enregistrez, transférez et gérez des domaines DNS dans ZSoftly Cloud Platform, y compris la
  configuration des serveurs de noms ZSoftly chez les registraires courants.
---

Gérez le DNS faisant autorité de vos domaines directement dans ZCP. Ajoutez un domaine, faites
pointer votre registraire vers les serveurs de noms ZSoftly et gérez tous vos enregistrements depuis
une seule console.

## Vue d'ensemble

La section **DNS** vous permet d'héberger la zone DNS de votre domaine sur l'infrastructure ZSoftly.
Après l'ajout du domaine et la configuration des serveurs de noms ZSoftly chez votre registraire,
ZCP devient le fournisseur DNS faisant autorité pour ce domaine.

Flux de travail typique :

1. **Ajouter votre domaine** à ZCP (par exemple, `example.com`).
2. **Mettre à jour les serveurs de noms** chez votre registraire pour les faire pointer vers
   ZSoftly.
3. **Ajouter des enregistrements DNS** (A, AAAA, CNAME, MX, TXT et autres) pour acheminer le trafic.
4. **Vérifier la propagation** et mettre le domaine en service.

## Ajouter un domaine

1. Accédez à **DNS → Domaines** dans la console ZCP.
2. Cliquez sur **Ajouter un domaine**.
3. Entrez le nom de domaine (par exemple, `example.com`) et confirmez.
4. ZCP crée la zone DNS et affiche les **serveurs de noms** à configurer chez votre registraire.

## Serveurs de noms ZSoftly

Après l'ajout d'un domaine, ZCP attribue **deux serveurs de noms faisant autorité**. Configurez les
paramètres de serveurs de noms (NS) de votre domaine avec ces valeurs dans le panneau de contrôle de
votre registraire :

| Serveur de noms | Valeur           |
| --------------- | ---------------- |
| Principal       | `ns1.zsoftly.ca` |
| Secondaire      | `ns2.zsoftly.ca` |

:::note

Les noms d'hôte exacts des serveurs de noms apparaissent aussi dans la console ZCP lorsque vous
ajoutez votre domaine. Si la console affiche des valeurs différentes, utilisez toujours celles qui y
sont indiquées.

:::

## Mettre à jour les serveurs de noms chez votre registraire

Pour rendre ZSoftly faisant autorité pour votre domaine, remplacez les serveurs de noms chez le
registraire où vous avez **acheté** le domaine par les deux valeurs ZSoftly. Le processus général
est le même partout :

1. Connectez-vous chez votre registraire.
2. Trouvez les paramètres **Serveurs de noms** (ou **DNS** / **Name server**) de votre domaine.
3. Passez des serveurs de noms par défaut gérés par le registraire à des **serveurs de noms
   personnalisés**.
4. Entrez les deux serveurs de noms ZSoftly (principal et secondaire) exactement comme dans la
   console ZCP.
5. Retirez tout serveur de noms restant afin que seules les deux valeurs ZSoftly demeurent.
6. Enregistrez vos changements.

:::caution

Les changements de serveurs de noms peuvent prendre de 24 à 48 heures pour se propager à l'échelle
mondiale, et se terminent souvent plus rapidement. Pendant la propagation, les visiteurs peuvent
atteindre l'ancien ou le nouveau DNS. Ajoutez vos enregistrements DNS dans ZCP _avant_ de changer
les serveurs de noms afin d'éviter une interruption.

:::

### Référence rapide des registraires

Trouvez votre registraire ci-dessous et suivez son guide officiel. Les étapes et les noms de menus
changent avec le temps; la documentation du fournisseur demeure donc la source de vérité.

| Registraire                                           | Guide officiel pour modifier les serveurs de noms                                                                                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GoDaddy**                                           | [Modifier les serveurs de noms d'un domaine](https://www.godaddy.com/help/change-my-domain-nameservers-664)                                                       |
| **Namecheap**                                         | [Comment modifier le DNS d'un domaine](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)                       |
| **Squarespace Domains** (anciennement Google Domains) | [Modifier les serveurs de noms](https://support.squarespace.com/hc/en-us/articles/4404183898125-Making-changes-to-nameservers)                                    |
| **Amazon Route 53**                                   | [Ajouter ou modifier des serveurs de noms et des glue records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-name-servers-glue-records.html)   |
| **IONOS**                                             | [Utiliser vos propres serveurs de noms pour un domaine](https://www.ionos.com/help/domains/using-your-own-name-servers/using-your-own-name-servers-for-a-domain/) |
| **Name.com**                                          | [Modifier les serveurs de noms pour la gestion DNS](https://www.name.com/support/articles/205934547-changing-nameservers-for-dns-management)                      |
| **Hover**                                             | [Modifier les serveurs de noms de votre domaine](https://support.hover.com/support/solutions/articles/201000064742-changing-your-domain-nameservers)              |
| **Porkbun**                                           | [Modifier les serveurs de noms](https://kb.porkbun.com/article/22-how-to-change-nameservers)                                                                      |
| **Bluehost**                                          | [Modifier les serveurs de noms Bluehost](https://www.bluehost.com/help/article/custom-nameservers)                                                                |
| **HostGator**                                         | [Changer les serveurs de noms avec d'autres registraires](https://www.hostgator.com/help/article/how-do-i-change-my-dns-or-name-servers)                          |
| **Cloudflare Registrar**                              | Voir l'[exception Cloudflare](#exception-cloudflare) ci-dessous. La modification directe des serveurs de noms n'est **pas** prise en charge.                      |

### Exemple : GoDaddy

1. Connectez-vous à votre
   [portefeuille de domaines GoDaddy](https://dcc.godaddy.com/control/portfolio).
2. Sélectionnez votre domaine, puis choisissez **Domain Edit Options → Edit Nameservers** (ou le
   menu **⋯** → **Edit Nameservers**).
3. Choisissez **I'll use my own nameservers**.
4. Remplacez les valeurs existantes par les deux serveurs de noms ZSoftly affichés dans la console
   ZCP.
5. Cliquez sur **Save**.

### Exemple : Namecheap

1. Connectez-vous à Namecheap et ouvrez **Domain List** dans la barre latérale gauche.
2. Cliquez sur **Manage** à côté de votre domaine.
3. Dans la section **Nameservers**, sélectionnez **Custom DNS** dans la liste déroulante.
4. Entrez les deux serveurs de noms ZSoftly dans les champs prévus.
5. Cliquez sur la coche verte **✓** pour enregistrer.

:::tip

La plupart des registraires suivent le même modèle : trouvez **Nameservers**, passez à **Custom
DNS** et entrez les deux valeurs ZSoftly. Si vous ne trouvez pas le paramètre, cherchez _"change
nameservers"_ dans le centre d'aide du registraire.

:::

## Exception Cloudflare

**Cloudflare Registrar ne permet pas de faire pointer votre domaine vers des serveurs de noms tiers
comme ceux de ZSoftly.** Selon la
[FAQ du registraire Cloudflare](https://developers.cloudflare.com/registrar/faq/), un domaine
enregistré chez Cloudflare _doit_ utiliser les serveurs de noms attribués par Cloudflare. Aucun
champ ne permet de saisir des serveurs de noms personnalisés, et Cloudflare l'indique au moment de
l'achat.

Si votre domaine est enregistré avec **Cloudflare Registrar**, choisissez plutôt l'une de ces deux
approches :

**Option A : recréer les enregistrements dans Cloudflare (conserver le domaine chez Cloudflare).**
Laissez le domaine sur les serveurs de noms Cloudflare et créez manuellement, dans le tableau de
bord Cloudflare, les enregistrements DNS qui pointent vers vos ressources ZSoftly (par exemple, un
enregistrement `A` vers l'IP publique de votre instance ZCP). Dans cette configuration, Cloudflare
reste faisant autorité et vous gérez les enregistrements dans Cloudflare plutôt que dans ZCP.
Utilisez le
[guide des enregistrements DNS Cloudflare](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/).

**Option B : transférer le domaine vers un registraire qui permet les serveurs de noms
personnalisés.** Transférez le domaine hors de Cloudflare vers un registraire comme GoDaddy,
Namecheap ou Porkbun, puis suivez la référence rapide des registraires ci-dessus pour faire pointer
ses serveurs de noms vers ZSoftly. Consultez le
[guide de transfert sortant de Cloudflare](https://developers.cloudflare.com/registrar/account-options/transfer-out-from-cloudflare/).
Les transferts de registraire prennent plusieurs jours, et le domaine doit être déverrouillé avec un
code de transfert (EPP/auth) valide.

:::note

Cette restriction s'applique seulement lorsque Cloudflare est votre **registraire**. Si votre
domaine est enregistré ailleurs et _utilise_ simplement les serveurs de noms Cloudflare, modifiez
les serveurs de noms chez le registraire réel à l'aide des guides ci-dessus.

:::

## Vérifier la propagation

Après l'enregistrement, confirmez que ZSoftly est bien vu comme faisant autorité pour votre domaine.

Depuis un terminal :

```bash
# Query your domain's name servers
dig NS example.com +short

# Or on Windows
nslookup -type=ns example.com
```

Vous devriez voir les serveurs de noms ZSoftly dans la réponse. Pour vérifier la propagation
globale, utilisez un outil en ligne comme [whatsmydns.net](https://www.whatsmydns.net/)
(sélectionnez le type d'enregistrement **NS**).

:::caution

Si les anciens serveurs de noms apparaissent encore après 48 heures, vérifiez que vous avez
enregistré les **deux** valeurs ZSoftly, retiré les entrées obsolètes et que le domaine n'est pas
verrouillé ou expiré chez le registraire.

:::

## Prochaines étapes

- [Vue d'ensemble du DNS](/fr/public-cloud/dns/overview) : comprenez le rôle des zones, des serveurs
  de noms et des enregistrements.
- [Gérer les enregistrements DNS](/fr/public-cloud/dns/records) : ajoutez et modifiez des
  enregistrements A, AAAA, CNAME, MX, TXT, CAA et NS lorsque ZSoftly fait autorité.
- [Exemples pratiques](/fr/public-cloud/dns/examples) : hébergez un site Web, acheminez les
  courriels, vérifiez la propriété, limitez l'émission de certificats ou déléguez un sous-domaine.
- [Dépannage](/fr/public-cloud/dns/troubleshooting) : vérifiez la propagation et corrigez les
  problèmes courants.

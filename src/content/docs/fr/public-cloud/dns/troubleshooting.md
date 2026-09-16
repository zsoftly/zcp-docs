---
title: Dépannage DNS
description:
  Vérifiez la propagation DNS, interrogez directement les serveurs de noms ZSoftly et corrigez les
  problèmes d'enregistrements DNS les plus courants sur ZCP.
---

Utilisez ces vérifications pour confirmer une modification DNS et résoudre les problèmes courants.

## Vérifier un enregistrement avant la propagation

Un serveur de noms ZSoftly répond pour votre zone dès l'enregistrement d'une modification, même
avant que celle-ci soit visible partout. Interrogez-le directement pour vérifier l'enregistrement :

```bash
dig A www.example.com @ns1.zsoftly.ca +short
dig A www.example.com @ns2.zsoftly.ca +short
```

Les deux serveurs de noms doivent renvoyer la même réponse. Si la requête directe est correcte, mais
que les résolveurs publics donnent une autre réponse, l'enregistrement est valide. Vous attendez la
propagation ou l'expiration d'une ancienne valeur en cache.

## Confirmer la délégation

Les résolveurs publics atteignent vos enregistrements ZCP après la délégation du domaine à ZSoftly.
Confirmez que la réponse publique contient les serveurs de noms ZSoftly :

```bash
dig NS example.com +short
# ns1.zsoftly.ca.
# ns2.zsoftly.ca.
```

Si les anciens serveurs de noms apparaissent encore, la délégation ne s'est pas propagée ou n'a pas
été enregistrée chez le registraire. Voir [Domaines](/fr/public-cloud/dns/domains).

## Vérifier la propagation mondiale

Interrogez plusieurs résolveurs publics dans différentes régions. Ils doivent tous renvoyer la même
réponse :

```bash
for r in 1.1.1.1 8.8.8.8 9.9.9.9 208.67.222.222; do
  echo "$r:"; dig A www.example.com @$r +short
done
```

Pour obtenir une carte mondiale, utilisez un outil en ligne comme
[whatsmydns.net](https://www.whatsmydns.net/) et sélectionnez le type d'enregistrement.

## Problèmes courants

### Un domaine en `.ca` ne se délègue pas vers ZSoftly

Votre registraire refuse le changement de serveurs de noms avec une erreur indiquant que l'hôte du
serveur de noms n'existe pas au registre. L'erreur affichée est la suivante : _« Object does not
exist. Create the host on the Registry system before you assign it to a domain. »_ Les recherches de
`ns1.zsoftly.ca` auprès du registre `.ca` renvoient _nameserver not found_.

Il s'agit d'une étape d'enregistrement que nous devons effectuer auprès du registre `.ca` pour nos
propres serveurs de noms, et elle ne concerne que les domaines en `.ca`. Réessayer le changement
donnera la même erreur. Laissez le domaine sur ses serveurs de noms actuels et ouvrez un
[billet de soutien](/fr/troubleshooting#ouvrir-un-billet-de-soutien) pour être prévenu lorsque la
délégation pourra avoir lieu.

### La modification n'apparaît pas

Les résolveurs conservent les enregistrements en cache pendant la durée du TTL. Avec la valeur par
défaut de `14400`, soit 4 heures, un résolveur qui possède l'ancienne valeur attend jusqu'à quatre
heures avant de l'actualiser. Réduisez le TTL à `300` un ou deux jours avant une modification
prévue, puis augmentez-le de nouveau après celle-ci.

### Un CNAME à la racine ne fonctionne pas

Un `CNAME` ne peut pas se trouver au sommet (`@`) ni partager un nom avec un autre enregistrement.
Utilisez un enregistrement `A` ou `AAAA` pour la racine. Voir
[Enregistrements CNAME](/fr/public-cloud/dns/records/cname).

### Corriger le refus d'un enregistrement MX

Un enregistrement `MX` exige une **priorité** dans son propre champ. Dans la CLI, passez
`--priority`. Dans l'API, envoyez `priority` dans un champ distinct. Voir
[Enregistrements MX](/fr/public-cloud/dns/records/mx).

### L'enregistrement TXT semble incorrect ou est refusé

Le contenu `TXT` est une chaîne entre guillemets. Une valeur sans guillemets est une cause possible
du message `DNS operation failed. Please try again or contact support.` La plateforme renvoie ce
même message pour d'autres échecs, dont toute tentative de créer un enregistrement `SRV` ou `LOC`.
Vérifiez d'abord les guillemets. Dans la CLI, protégez la valeur afin que l'interpréteur de
commandes transmette les guillemets, par exemple `'"v=spf1 -all"'`. Voir
[Enregistrements TXT](/fr/public-cloud/dns/records/txt) et
[Limites connues](/fr/public-cloud/dns/records#limites-connues) pour les autres causes.

### Un nouvel enregistrement en a remplacé un autre

Un nom et un type contiennent une seule valeur. La création d'une deuxième valeur sous le même nom
et le même type remplace la première, sans avertissement. Cette règle s'applique à tous les types
d'enregistrement, y compris `A` et `AAAA` : un nom se résout vers une seule adresse IPv4 et une
seule adresse IPv6. Voir [Limites connues](/fr/public-cloud/dns/records#limites-connues).

### Un enregistrement SRV ou LOC échoue

Les enregistrements `SRV` et `LOC` ne sont pas encore disponibles, et les deux échouent avec le
message `DNS operation failed. Please try again or contact support.` Les autres types (`A`, `AAAA`,
`CNAME`, `MX`, `TXT`, `CAA` et `NS`) fonctionnent. Voir
[Limites connues](/fr/public-cloud/dns/records#limites-connues).

### NXDOMAIN ou absence de réponse

`NXDOMAIN` signifie que le nom n'existe pas dans la zone. Une réponse vide accompagnée de `NOERROR`
signifie que le nom existe, mais ne possède aucun enregistrement du type demandé. Vérifiez le nom et
le type demandés.

## Lire la zone telle que la voit la plateforme

`zcp dns show <slug>` affiche le domaine et tous ses enregistrements, y compris ceux de type `SOA`
et `NS` gérés par ZCP. Comparez cette sortie avec celle de `dig` pour trouver un enregistrement
manquant ou une faute de frappe.

```bash
zcp dns show examplecom
```

Voir aussi : [Vue d'ensemble du DNS](/fr/public-cloud/dns/overview),
[Domaines](/fr/public-cloud/dns/domains), [Exemples pratiques](/fr/public-cloud/dns/examples)

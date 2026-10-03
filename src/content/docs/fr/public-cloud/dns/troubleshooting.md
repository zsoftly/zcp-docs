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

### Un CNAME est refusé

La création d'un `CNAME` sous un nom qui contient déjà d'autres enregistrements échoue avec une
erreur du type `RRset www IN CNAME: Conflicts with pre-existing RRset`. Un `CNAME` ne peut pas
partager un nom avec un autre enregistrement. Supprimez d'abord les autres enregistrements sous ce
nom, ou utilisez un autre nom. Voir [Limites connues](/fr/public-cloud/dns/records#limites-connues).

### Un nouvel enregistrement a été ajouté au lieu d'en remplacer un

Un nom et un type peuvent contenir plusieurs valeurs. La création d'un enregistrement sous un nom et
un type qui contiennent déjà des valeurs ajoute la nouvelle valeur à l'ensemble. Pour retirer une
valeur indésirable, supprimez-la dans la console, qui retire uniquement cette valeur.
`zcp dns record-delete` retire l'ensemble complet sous un nom et un type, donc recréez ensuite les
valeurs à conserver. Voir
[Plusieurs valeurs par nom et par type](/fr/public-cloud/dns/records#plusieurs-valeurs-par-nom-et-par-type).

### Une valeur TXT apparaît avec des guillemets

La plateforme stocke une valeur `TXT` entre guillemets et la renvoie entre guillemets, que vous les
ayez saisis ou non. `dig` affiche les guillemets. Voir
[Enregistrements TXT](/fr/public-cloud/dns/records/txt).

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

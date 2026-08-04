---
title: Port SMTP 25
description:
  Le port SMTP sortant (25) est bloqué par défaut sur les instances de calcul ZCP afin de protéger
  la réputation d'envoi. Découvrez ce qui est bloqué et comment demander une exception.
sidebar_position: 5
---

ZCP bloque le port TCP 25 sortant par défaut sur chaque instance de calcul afin de protéger la
réputation d'envoi de courriel de la plateforme. Un pourriel ou une instance compromise qui envoie
du courriel directement sur le port 25 peut nuire à la réputation d'une plage d'adresses IP partagée
et toucher les autres clients de cette plage. La plupart des grands fournisseurs infonuagiques
appliquent le même paramètre par défaut.

## Accès au port 25

| Trafic                        | État              |
| ----------------------------- | ----------------- |
| Port TCP 25 sortant (IPv4)    | Bloqué par défaut |
| Port TCP 25 sortant (IPv6)    | Bloqué par défaut |
| Ports TCP 465 et 587 sortants | Ouverts           |
| Port TCP 25 entrant           | Ouvert            |

## Envoyer du courriel depuis votre instance

Envoyez votre courriel sortant par un relais SMTP authentifié ou un fournisseur de courriel
transactionnel sur le port 587 ou 465, plutôt que directement sur le port 25. Ces deux ports sont
ouverts par défaut. Un relais gère aussi les nouvelles tentatives de livraison, les rebonds et la
réputation d'envoi.

## Demander l'ouverture du port 25

ZSoftly étudie les demandes d'ouverture du port 25 des clients vérifiés qui exploitent un serveur de
messagerie de production. Nous évaluons chaque demande selon son usage prévu et son historique
d'envoi.

### Comment faire la demande

- Principal: ouvrez une demande de soutien depuis la console infonuagique.
- Secondaire: écrivez à [support@zsoftly.ca](mailto:support@zsoftly.ca).

Incluez les éléments suivants dans votre demande:

- Le nom de votre compte.
- Les adresses IP publiques pour lesquelles vous demandez l'ouverture.
- Une brève description de l'usage prévu du courriel et du volume attendu.
- La confirmation que SPF et DKIM sont configurés pour le domaine d'envoi.
- Le nom d'hôte DNS inversé (PTR) souhaité pour chaque adresse IP.

:::note

ZSoftly configure l'enregistrement PTR pour chaque adresse IP approuvée. La plupart des serveurs de
messagerie destinataires s'attendent à un enregistrement PTR valide qui correspond à votre domaine
d'envoi.

:::

Voir aussi : [IP publiques](/fr/public-cloud/networking/public-network/public-ips),
[Règles de sortie](/fr/public-cloud/networking/public-network/egress-rules)

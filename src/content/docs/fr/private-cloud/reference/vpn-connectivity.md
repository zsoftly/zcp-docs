---
title: Connectivité VPN
sidebar_position: 3
---

# Référence de connectivité VPN

ZSoftly utilise WireGuard pour l'accès VPN aux environnements de nuage privé.

## Détails de configuration

Votre fichier de configuration WireGuard, fourni lors de la remise, contient :

- **Endpoint** : l'adresse IP publique et le port de la passerelle VPN ZSoftly.
- **Allowed IPs** : les plages de réseaux privés accessibles par le VPN.
- **Private Key** : votre clé privée client unique, à ne pas partager.
- **Public Key** : la clé publique du serveur.

## Dépannage

**Impossible de se connecter au VPN :**

- Vérifiez que l'adresse IP du point de terminaison est joignable : `ping <vpn-endpoint-ip>`.
- Vérifiez que le port UDP 51820 n'est pas bloqué par votre pare-feu local.
- Assurez-vous que `wg-quick up wg0` s'est terminé sans erreur (`sudo wg-quick up wg0 2>&1`).

**Connecté au VPN, mais le serveur de gestion est injoignable :**

- Exécutez `sudo wg show` pour confirmer que la négociation a réussi; la sortie devrait indiquer un
  `latest handshake` récent.
- Vérifiez que l'adresse IP du serveur de gestion fait partie de la plage `AllowedIPs` dans votre
  configuration.
- Essayez `ping <management-server-ip>` depuis la ligne de commande.

**Besoin d'une nouvelle configuration VPN (clé perdue, nouvel appareil) :**

- Communiquez avec le soutien ZSoftly. Une nouvelle configuration exige la génération d'une nouvelle
  paire de clés sur le serveur.

Voir aussi : [Accès VPN](/fr/private-cloud/getting-started/vpn-access)

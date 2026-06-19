---
title: Tailscale
---

Tailscale est un VPN sans configuration basé sur WireGuard. Il connecte vos appareils et serveurs
dans un réseau privé chiffré de bout en bout, sans vous obliger à gérer des règles de pare-feu, à
ouvrir des ports ou à configurer des certificats. Cette image fournit une VM avec le client
Tailscale préinstallé, prête à joindre votre Tailnet.

## Logiciels inclus

| Composant | Version         |
| --------- | --------------- |
| Tailscale | Dernière stable |
| Ubuntu    | 24.04 LTS       |

## Variables d'environnement

Vous pouvez éventuellement fournir une clé d'authentification Tailscale lors du déploiement depuis
la marketplace. Si elle est définie, la VM rejoint automatiquement votre Tailnet au premier
démarrage ; sinon, connectez-vous manuellement avec `tailscale up` après le déploiement.

| Variable     | Description                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| `TS_AUTHKEY` | Clé d'authentification Tailscale pour rejoindre votre Tailnet au démarrage. |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Joignez votre Tailnet

**Option A : automatique avec cloud-init (au déploiement)**

Fournissez votre clé d'authentification Tailscale dans les userdata de la VM avant le déploiement:

```yaml
#cloud-config
write_files:
  - path: /run/tailscale-authkey
    content: 'tskey-auth-xxxxxxxxxxxxxxxx'
    permissions: '0600'
    owner: root:root
```

La VM se connectera automatiquement à votre Tailnet au premier démarrage.

**Option B : manuelle (après SSH)**

Générez une clé d'authentification à
[tailscale.com/admin/settings/keys](https://login.tailscale.com/admin/settings/keys), puis exécutez:

```bash
sudo tailscale up --authkey tskey-auth-xxxxxxxxxxxxxxxx
```

### 3. Vérifiez la connexion

```bash
tailscale status
```

La VM devrait apparaître avec son adresse IP Tailscale, habituellement dans la plage `100.x.x.x`. Le
MOTD affiché à la connexion indique l'état de connexion actuel.

```bash
tailscale ip -4
```

## Gérer Tailscale

```bash
# Vérifier l'état de la connexion
tailscale status

# Déconnecter du Tailnet
sudo tailscale down

# Reconnecter
sudo tailscale up

# Consulter les journaux
sudo journalctl -u tailscaled -f
```

## Routage et noeuds de sortie

**Annoncez la VM comme routeur de sous-réseau** pour exposer votre réseau ZCP aux autres appareils
du Tailnet:

```bash
sudo tailscale up --advertise-routes=<your-subnet-cidr>
```

**Utilisez-la comme noeud de sortie** pour acheminer tout le trafic Tailnet par cette VM:

```bash
sudo tailscale up --advertise-exit-node
```

Activez ces options dans la console d'administration Tailscale après avoir exécuté la commande
ci-dessus.

## Sécurité

Tailscale gère son propre chiffrement et sa propre authentification. Aucune règle de pare-feu
supplémentaire n'est requise pour le trafic Tailnet. UFW reste activé et n'autorise que SSH (port
22).

Une fois connectée à votre Tailnet, cette VM est joignable par les autres appareils Tailnet à son
adresse `100.x.x.x`. Le contrôle d'accès est géré au moyen des ACL Tailscale dans la console
d'administration.

:::caution

Les clés d'authentification expirent. Pour les déploiements de longue durée, utilisez une clé
réutilisable ou préapprouvée depuis la console d'administration Tailscale.

:::

## Prochaines étapes

- [Documentation Tailscale](https://tailscale.com/kb/)
- [Listes de contrôle d'accès (ACL)](https://tailscale.com/kb/1018/acls/)
- [Routeurs de sous-réseau](https://tailscale.com/kb/1019/subnets/)

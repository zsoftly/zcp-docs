---
title: OpenBao
---

OpenBao est une plateforme libre de gestion des secrets qui stocke et contrôle l'accès aux jetons,
mots de passe, certificats et clés de chiffrement de manière sécurisée. Il s'agit du fork
communautaire de HashiCorp Vault maintenu par la Linux Foundation, et il reste compatible avec son
API. La plupart des outils Vault fonctionnent donc sans modification. Vous l'exécutez comme un
serveur, l'initialisez une seule fois, puis le descellez pour commencer à servir des secrets.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| OpenBao   | 2.5.5     |
| Ubuntu    | 24.04 LTS |

OpenBao s'exécute comme service systemd avec le stockage Raft intégré. Chaque machine virtuelle
génère son propre certificat TLS au premier démarrage, aucune clé privée n'est donc partagée entre
les déploiements.

:::caution

Cette image déploie un seul nœud. Un cluster Raft à un nœud n'offre aucun basculement. Pour la haute
disponibilité, provisionnez d'autres instances depuis ce modèle et joignez-les comme pairs Raft.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Variables d'environnement

Vous pouvez définir ces variables au déploiement d'OpenBao depuis la Place de marché. Laissez-les
vides pour utiliser l'adresse de la machine virtuelle et recevoir les secrets générés en clair.

| Variable                     | Description                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `OPENBAO_ADDR`               | Adresse inscrite dans le certificat TLS et dans l'adresse du cluster Raft              |
| `OPENBAO_UNSEAL_PGP_KEYS`    | Clés publiques PGP séparées par des virgules. Chaque part de descellement est chiffrée |
| `OPENBAO_ROOT_TOKEN_PGP_KEY` | Une clé publique PGP. Le jeton racine est renvoyé chiffré avec cette clé               |

Chaque entrée PGP est soit `keybase:<username>`, soit une clé publique ASCII-armored encodée en
base64. Ces variables ne permettent pas de choisir la valeur des secrets. OpenBao génère toujours
lui-même le jeton racine et les clés de descellement. Elles déterminent uniquement à qui ces valeurs
sont chiffrées.

:::note

Lorsque vous fournissez `OPENBAO_UNSEAL_PGP_KEYS`, le nombre de clés devient le nombre de parts et
le seuil de descellement, et la machine virtuelle ne peut pas se desceller elle-même, car elle ne
détient aucune clé privée. Déchiffrez votre part localement et exécutez `bao operator unseal`
vous-même.

:::

## Démarrage

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script génère un certificat TLS pour cette VM, démarre OpenBao,
l'initialise avec 5 parts de clé et un seuil de 3, puis le descelle. Suivez la progression:

```bash
journalctl -u openbao-first-boot.service -f
```

### 3. Récupérez les clés de descellement et le jeton racine

Ils sont écrits dans un fichier réservé à root:

```bash
sudo cat /etc/openbao/credentials.txt
```

:::danger

Copiez les clés de descellement et le jeton racine en lieu sûr, puis retirez-les de la VM. Quiconque
détient le jeton racine contrôle entièrement vos secrets, et la perte des clés de descellement rend
les données irrécupérables.

:::

### 4. Utilisez l'API

```bash
export BAO_ADDR=https://<your-vm-ip>:8200
export BAO_SKIP_VERIFY=true
bao status
```

Le certificat est auto-signé. Faites-lui confiance ou définissez `BAO_SKIP_VERIFY` pendant vos
tests. Remplacez-le par votre propre certificat en production.

## Gérer OpenBao

```bash
# Vérifier l'état
sudo systemctl status openbao

# Redémarrer
sudo systemctl restart openbao

# Consulter les journaux
sudo journalctl -u openbao -f
```

La configuration se trouve dans `/etc/openbao`, les données Raft dans `/opt/openbao/data`, et le
certificat propre à la VM dans `/etc/openbao/tls`.

## Sécurité

Le port 8200 n'est ouvert qu'après que le service a répondu à un contrôle de santé en TLS. UFW est
activé et autorise ce port ainsi que SSH (port 22).

OpenBao se rescelle à chaque redémarrage du service. Descellez-le de nouveau avec trois de vos
parts:

```bash
bao operator unseal
```

**Pour restreindre l'accès à une adresse IP précise:**

```bash
sudo ufw delete allow 8200/tcp
sudo ufw allow from <trusted-ip> to any port 8200
```

## Prochaines étapes

- [Documentation OpenBao](https://openbao.org/docs/)
- [Concepts de scellement et descellement](https://openbao.org/docs/concepts/seal/)
- [Stockage Raft intégré](https://openbao.org/docs/internals/integrated-storage/)

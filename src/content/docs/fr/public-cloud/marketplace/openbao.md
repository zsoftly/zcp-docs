---
title: OpenBao
---

OpenBao est une plateforme libre de gestion des secrets qui stocke et contrôle l'accès aux jetons,
mots de passe, certificats et clés de chiffrement de manière sécurisée. Il s'agit du fork
communautaire de HashiCorp Vault maintenu par la Linux Foundation, et il reste compatible avec son
API. La plupart des outils Vault fonctionnent donc sans modification. Vous l'exécutez comme un
serveur, l'initialisez une seule fois, puis le descellez pour commencer à servir des secrets.

:::note[Bientôt disponible]

Une image OpenBao préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer OpenBao vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **OpenBao** et cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Les deux
   vous donnent une VM Ubuntu 24.04 propre.
2. Choisissez un forfait conforme aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour:

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer OpenBao

OpenBao publie un dépôt APT officiel. Ajoutez sa clé de signature et sa source, puis installez le
paquet `openbao`.

```bash
sudo apt install -y gpg wget
sudo mkdir -p /usr/share/keyrings
wget -qO- https://pkg.openbao.org/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/openbao-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/openbao-keyring.gpg] https://pkg.openbao.org/deb stable main" | sudo tee /etc/apt/sources.list.d/openbao.list
```

Installez OpenBao:

```bash
sudo apt update
sudo apt install -y openbao
```

Le paquet installe la CLI `bao`, un utilisateur `openbao` dédié, un service systemd et un fichier de
configuration par défaut dans `/etc/openbao/openbao.hcl`.

## Configurer OpenBao

Modifiez `/etc/openbao/openbao.hcl` pour utiliser le stockage intégré (Raft) et écouter sur toutes
les interfaces. Ce listener de démarrage rapide désactive TLS afin que vous puissiez vérifier
l'installation. Consultez la note TLS ci-dessous avant de l'exposer.

```bash
sudo tee /etc/openbao/openbao.hcl >/dev/null <<'EOF'
ui = true

storage "raft" {
  path    = "/opt/openbao/data"
  node_id = "openbao-1"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = true
}

api_addr     = "http://127.0.0.1:8200"
cluster_addr = "https://127.0.0.1:8201"
EOF

sudo mkdir -p /opt/openbao/data
sudo chown -R openbao:openbao /opt/openbao
```

Activez et démarrez le service, puis pointez la CLI vers l'API locale:

```bash
sudo systemctl enable --now openbao
export BAO_ADDR='http://127.0.0.1:8200'
```

Initialisez OpenBao une seule fois. Cette commande affiche les clés de descellement et le jeton root
initial. Conservez-les en lieu sûr. Ils ne peuvent pas être récupérés:

```bash
bao operator init
```

OpenBao démarre **scellé**. Descellez-le en fournissant le seuil de clés de descellement (trois par
défaut), en exécutant la commande une fois par clé:

```bash
bao operator unseal
```

Une fois descellé, connectez-vous avec le jeton root pour commencer à gérer les secrets:

```bash
bao login
```

:::caution

Le listener de démarrage rapide ci-dessus fonctionne sans TLS. Avant d'exposer OpenBao au-delà de
cet hôte, activez TLS dans le bloc `listener "tcp"` (définissez `tls_cert_file` et `tls_key_file`,
supprimez `tls_disable`) ou placez-le derrière un reverse proxy qui termine HTTPS. Ne servez jamais
de secrets de production en HTTP non chiffré.

:::

## Ouvrir le pare-feu

L'instance n'autorise que SSH (port 22) en externe par défaut. Ouvrez le port de l'API qu'OpenBao
sert et ajoutez-le aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 8200/tcp
```

## Étapes suivantes

- [Documentation OpenBao](https://openbao.org/docs/)
- [Guide d'installation d'OpenBao](https://openbao.org/docs/install/)

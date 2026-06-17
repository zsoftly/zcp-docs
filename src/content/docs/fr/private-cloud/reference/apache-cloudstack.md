---
title: Apache CloudStack
sidebar_position: 1
---

# Référence Apache CloudStack

Apache CloudStack est la plateforme d'orchestration infonuagique au cœur de ZSoftly Private Cloud.

## Version

Votre document d'identifiants précise la version exacte de CloudStack déployée dans votre
environnement.

## Documentation officielle

| Ressource              | URL                                                        |
| ---------------------- | ---------------------------------------------------------- |
| Guide d'installation   | https://docs.cloudstack.apache.org/en/latest/installguide/ |
| Guide d'administration | https://docs.cloudstack.apache.org/en/latest/adminguide/   |
| Guide utilisateur      | https://docs.cloudstack.apache.org/en/latest/userguide/    |
| Référence API          | https://cloudstack.apache.org/api.html                     |
| Notes de version       | https://docs.cloudstack.apache.org/en/latest/releasenotes/ |

ZSoftly ne maintient pas de miroir de la documentation CloudStack. La documentation officielle
ci-dessus fait autorité.

## CloudMonkey (cmk)

CloudMonkey est la CLI officielle de CloudStack. ZSoftly utilise le **binaire Go** (v6.5.0), et non
le paquet Python.

### Installer

**Linux:**

```bash
ARCH=$(uname -m)
case "$ARCH" in
  x86_64)  BINARY="cmk.linux.x86-64" ;;
  aarch64) BINARY="cmk.linux.arm64" ;;
  armv7l)  BINARY="cmk.linux.arm32" ;;
  i686)    BINARY="cmk.linux.x86" ;;
  *)       echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac
wget "https://github.com/apache/cloudstack-cloudmonkey/releases/download/6.5.0/${BINARY}"
chmod +x "$BINARY"
sudo mv "$BINARY" /usr/local/bin/cmk
cmk version
```

**macOS:**

```bash
ARCH=$(uname -m)
case "$ARCH" in
  arm64)  BINARY="cmk.darwin.arm64" ;;
  x86_64) BINARY="cmk.darwin.x86-64" ;;
  *)      echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac
curl -LO "https://github.com/apache/cloudstack-cloudmonkey/releases/download/6.5.0/${BINARY}"
chmod +x "$BINARY"
sudo mv "$BINARY" /usr/local/bin/cmk
cmk version
```

**Windows :** téléchargez le fichier `.exe` depuis la
[page des versions](https://github.com/apache/cloudstack-cloudmonkey/releases/tag/6.5.0),
renommez-le `cmk.exe`, puis ajoutez son dossier à `PATH`.

### Configurer

L'URL de votre serveur de gestion se trouve dans le document d'identifiants fourni lors de la
remise.

```bash
cmk set profile admin
cmk set url https://<your-management-server>/client/api
cmk set output json
cmk set asyncblock true
cmk set apikey <your-api-key>
cmk set secretkey <your-secret-key>
```

Synchronisez le cache de l'API une fois après la première configuration :

```bash
cmk sync
```

La configuration est enregistrée dans `$HOME/.cmk/config`.

### Obtenir les identifiants API

Dans l'interface CloudStack : menu du nom d'utilisateur en haut à droite → **View API credentials**.

### Vérifier

```bash
cmk list zones | grep -o '"name": "[^"]*"'
```

### Exemples d'utilisation

```bash
cmk list zones
cmk list virtualmachines listall=true
cmk list routers listall=true
cmk listCapabilities | grep cloudstackversion
```

Référence complète :
[github.com/apache/cloudstack-cloudmonkey](https://github.com/apache/cloudstack-cloudmonkey)

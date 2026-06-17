---
title: Accès VPN
sidebar_position: 3
---

L'accès à distance aux interfaces de gestion et aux réseaux internes de votre nuage privé nécessite
un accès VPN.

## Votre configuration VPN

ZSoftly fournit un fichier de configuration VPN WireGuard dans votre document d'identifiants. Le
fichier est nommé `<your-name>-wg0.conf`.

## Se connecter sous Linux

```bash
# Install WireGuard
sudo apt install wireguard   # Debian/Ubuntu
sudo dnf install wireguard-tools  # RHEL/Fedora

# Copy your config
sudo cp your-name-wg0.conf /etc/wireguard/wg0.conf

# Connect
sudo wg-quick up wg0

# Disconnect
sudo wg-quick down wg0

# Check status
sudo wg show
```

## Se connecter sous macOS

1. Installez [WireGuard for macOS](https://apps.apple.com/app/wireguard/id1451685025) depuis l'App
   Store.
2. Ouvrez WireGuard → **Import tunnel(s) from file**.
3. Sélectionnez votre fichier `.conf`.
4. Cliquez sur **Activate**.

## Se connecter sous Windows

1. Téléchargez [WireGuard for Windows](https://www.wireguard.com/install/).
2. Ouvrez WireGuard → **Import tunnel(s) from file**.
3. Sélectionnez votre fichier `.conf`.
4. Cliquez sur **Activate**.

## Vérifier la connectivité

Après la connexion, vérifiez que le serveur de gestion est joignable :

```bash
ping <management-server-ip>
```

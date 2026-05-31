---
title: VPN Access
sidebar_position: 3
---

# VPN Access

Reaching your private cloud management interfaces and internal networks remotely requires VPN
access.

## Your VPN configuration

ZSoftly provides a WireGuard VPN configuration file in your credentials document. The file is named
`<your-name>-wg0.conf`.

## Connect on Linux

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

## Connect on macOS

1. Install [WireGuard for macOS](https://apps.apple.com/app/wireguard/id1451685025) from the App
   Store
2. Open WireGuard → **Import tunnel(s) from file**
3. Select your `.conf` file
4. Click **Activate**

## Connect on Windows

1. Download [WireGuard for Windows](https://www.wireguard.com/install/)
2. Open WireGuard → **Import tunnel(s) from file**
3. Select your `.conf` file
4. Click **Activate**

## Verify connectivity

After connecting, verify you reach the management server:

```bash
ping <management-server-ip>
```

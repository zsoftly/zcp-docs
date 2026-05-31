---
title: VPN Connectivity
sidebar_position: 3
---

# VPN Connectivity Reference

ZSoftly uses WireGuard for VPN access to private cloud environments.

## Configuration details

Your WireGuard configuration file (provided at handover) contains:

- **Endpoint**: the public IP and port of the ZSoftly VPN gateway
- **Allowed IPs**: the private network ranges accessible through the VPN
- **Private Key**: your unique client private key (do not share)
- **Public Key**: the server's public key

## Troubleshooting

**Cannot connect to VPN:**

- Verify the endpoint IP is reachable: `ping <vpn-endpoint-ip>`
- Check that UDP port 51820 is not blocked by your local firewall
- Ensure `wg-quick up wg0` completed without errors (`sudo wg-quick up wg0 2>&1`)

**Connected to VPN but cannot reach management server:**

- Check `sudo wg show` to confirm the handshake succeeded (should show a recent `latest handshake`)
- Verify the management server IP is within the AllowedIPs range in your config
- Try `ping <management-server-ip>` from the command line

**Need a new VPN config (lost key, new device):**

- Contact ZSoftly support. A new config requires generating a new key pair on the server

See also: [VPN Access](../getting-started/vpn-access)

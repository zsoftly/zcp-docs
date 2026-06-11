---
title: Tailscale
---

Tailscale is a zero-config VPN built on WireGuard. It connects your devices and servers into a
private network with end-to-end encryption, without requiring you to manage firewall rules, open
ports, or configure certificates. This image ships a VM with the Tailscale client pre-installed,
ready to join your Tailnet.

## Software included

| Component | Version       |
| --------- | ------------- |
| Tailscale | Latest stable |
| Ubuntu    | 24.04 LTS     |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Join your Tailnet

**Option A — Automatic via cloud-init (at deploy time)**

Provide your Tailscale auth key in the VM's userdata before deploying:

```yaml
#cloud-config
write_files:
  - path: /run/tailscale-authkey
    content: 'tskey-auth-xxxxxxxxxxxxxxxx'
    permissions: '0600'
    owner: root:root
```

The VM will connect to your Tailnet automatically on first boot.

**Option B — Manual (after SSH)**

Generate an auth key at
[tailscale.com/admin/settings/keys](https://login.tailscale.com/admin/settings/keys), then run:

```bash
sudo tailscale up --authkey tskey-auth-xxxxxxxxxxxxxxxx
```

### 3. Verify the connection

```bash
tailscale status
```

You should see the VM listed with its Tailscale IP (usually in the `100.x.x.x` range). The MOTD on
login shows the current connection status.

```bash
tailscale ip -4
```

## Managing Tailscale

```bash
# Check connection status
tailscale status

# Disconnect from Tailnet
sudo tailscale down

# Reconnect
sudo tailscale up

# View logs
sudo journalctl -u tailscaled -f
```

## Routing and exit nodes

**Advertise as a subnet router** to expose your ZCP network to other Tailnet devices:

```bash
sudo tailscale up --advertise-routes=<your-subnet-cidr>
```

**Use as an exit node** to route all Tailnet traffic through this VM:

```bash
sudo tailscale up --advertise-exit-node
```

Enable both in the Tailscale admin console after running the above command.

## Security

Tailscale handles its own encryption and authentication — no additional firewall rules are needed
for Tailnet traffic. UFW remains enabled and allows SSH (port 22) only.

Once connected to your Tailnet, other Tailnet devices can reach this VM at its `100.x.x.x` address.
Access control is managed via Tailscale ACLs in the admin console.

:::caution

Auth keys expire. For long-lived deployments, use a reusable auth key or pre-approved key from the
Tailscale admin console.

:::

## Next steps

- [Tailscale documentation](https://tailscale.com/kb/)
- [Access control lists (ACLs)](https://tailscale.com/kb/1018/acls/)
- [Subnet routers](https://tailscale.com/kb/1019/subnets/)

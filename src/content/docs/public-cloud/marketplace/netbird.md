---
title: NetBird
---

NetBird is an open-source, WireGuard-based network overlay that connects servers and devices into a
peer-to-peer private network. It does not require opening inbound ports or configuring firewall
rules. All connections are initiated outbound. This image ships the NetBird client pre-installed,
ready to join your network.

## Software included

| Component | Version   |
| --------- | --------- |
| NetBird   | 0.71.4    |
| Ubuntu    | 24.04 LTS |

## Environment variables

You can optionally provide a NetBird setup key when deploying from the marketplace. If set, the VM
joins your NetBird network automatically at first boot; if left blank, connect manually with
`netbird up` after deploy.

| Variable       | Description                                          |
| -------------- | ---------------------------------------------------- |
| `NB_SETUP_KEY` | NetBird setup key used to join your network on boot. |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Join your NetBird network

You will need a setup key from your NetBird management console. Setup keys are created under **Setup
Keys** in the NetBird dashboard.

**With NetBird Cloud (app.netbird.io):**

```bash
sudo netbird up --setup-key <your-setup-key>
```

**With a self-hosted management server:**

```bash
sudo netbird up \
  --management-url https://<your-management-server> \
  --setup-key <your-setup-key>
```

### 3. Verify the connection

```bash
netbird status
```

You should see the VM listed with its NetBird IP. Other peers in the same network will appear in the
status output.

## Managing NetBird

```bash
# Check connection status
netbird status

# Disconnect
sudo netbird down

# Reconnect
sudo netbird up

# View logs
sudo journalctl -u netbird -f
```

## Security

NetBird uses WireGuard for encrypted peer-to-peer tunnels. All traffic between peers is encrypted
end-to-end. UFW is enabled and allows SSH (port 22) only. No additional ports need to be opened for
NetBird traffic.

Access control between peers is managed via policies in the NetBird management console.

## Next steps

- [NetBird documentation](https://docs.netbird.io/)
- [Setup keys guide](https://docs.netbird.io/manage/peers/register-machines-using-setup-keys)
- [Access control policies](https://docs.netbird.io/how-to/manage-network-access)

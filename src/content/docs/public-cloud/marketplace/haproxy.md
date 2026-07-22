---
title: HAProxy
---

HAProxy is a fast, reliable load balancer and proxy for TCP and HTTP applications. It distributes
traffic across backend servers, performs health checks, and terminates TLS, making it a common front
door for high-availability web services.

## Software included

| Component | Version   |
| --------- | --------- |
| HAProxy   | 3.2       |
| Ubuntu    | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Verify HAProxy is running

There is no first-boot configuration. HAProxy starts immediately after the VM boots.

```bash
systemctl status haproxy
```

### 3. Test the HTTP frontend

Open the default frontend in a browser:

```text
http://<your-vm-ip>
```

It returns:

```text
HAProxy is running
```

The local statistics page listens on `127.0.0.1:8404`. You can verify it from the VM:

```bash
curl http://127.0.0.1:8404/
```

## Managing HAProxy

```bash
# Check service status
systemctl status haproxy

# Validate the configuration
sudo haproxy -c -f /etc/haproxy/haproxy.cfg

# Restart
sudo systemctl restart haproxy

# View logs
sudo journalctl -u haproxy -f
```

| Path                       | Purpose                                |
| -------------------------- | -------------------------------------- |
| `/etc/haproxy/haproxy.cfg` | Main configuration                     |
| `/run/haproxy/admin.sock`  | Local administrative statistics socket |

## Security

Port 80 is open on the VM's network interface. UFW is enabled and allows HAProxy HTTP (port 80) and
SSH (port 22). The statistics page on port 8404 is bound to localhost only. Port 443 is not open by
default because the image does not provision a TLS certificate.

**To restrict the HTTP frontend to a specific IP:**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**To access the frontend without leaving port 80 open, use an SSH tunnel:**

First close the public port on the VM, since it is open by default:

```bash
sudo ufw delete allow 80/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080
```

**For production use**, configure TLS termination in HAProxy with a trusted certificate, or place it
behind a TLS-enabled proxy before accepting sensitive traffic.

:::caution

The default frontend is a readiness page, not a production load-balancer configuration. Replace it
with your own frontend and backend sections before directing application traffic to the VM.

:::

## Next steps

- [HAProxy documentation](https://www.haproxy.org/#docs)
- [HAProxy configuration manual](https://docs.haproxy.org/)

---
title: HAProxy
---

HAProxy is a fast, reliable load balancer and proxy for TCP and HTTP applications. It distributes
traffic across backend servers, performs health checks, and terminates TLS, making it a common front
door for high-availability web services.

:::note[Coming soon]

A pre-built HAProxy image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install HAProxy yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 10 GB   | 20 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab, search for
   **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from **Instances →
   Create**. Either way you get a clean Ubuntu 24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install HAProxy

Ubuntu 24.04 ships an LTS build of HAProxy in its default repositories:

```bash
sudo apt install -y haproxy
```

To install a newer release instead, use the official HAProxy package repository (PPA). For the
current stable series:

```bash
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:vbernat/haproxy-3.0
sudo apt update && sudo apt install -y haproxy
```

Enable and start the service:

```bash
sudo systemctl enable --now haproxy
```

Check the installed version:

```bash
haproxy -v
```

## Configure HAProxy

The configuration lives at `/etc/haproxy/haproxy.cfg`. The example below terminates HTTP on port 80
and balances requests across two backend web servers:

```bash
sudo tee /etc/haproxy/haproxy.cfg >/dev/null <<'EOF'
global
    log /dev/log local0
    maxconn 4096
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5s
    timeout client  50s
    timeout server  50s

frontend http_in
    bind *:80
    default_backend web_servers

backend web_servers
    balance roundrobin
    option httpchk GET /
    server web1 10.0.0.11:8080 check
    server web2 10.0.0.12:8080 check
EOF
```

Validate the configuration before reloading:

```bash
haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl reload haproxy
```

The ports HAProxy listens on depend entirely on the `bind` directives in your `frontend` sections,
so open the matching ports in the next step.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) HAProxy needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Next steps

- [HAProxy documentation](https://www.haproxy.org/#docs)
- [HAProxy configuration manual](https://docs.haproxy.org/)

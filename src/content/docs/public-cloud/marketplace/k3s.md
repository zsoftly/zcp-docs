---
title: K3s
---

K3s is a lightweight Kubernetes distribution packaged as a single binary. It is designed for small
clusters, edge environments, development, labs, and simple Kubernetes workloads that do not need the
full operational footprint of a larger Kubernetes platform.

## Software included

| Component | Version     |
| --------- | ----------- |
| K3s       | 1.36.2+k3s1 |
| Ubuntu    | 24.04 LTS   |

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

Size the instance for the workloads you plan to run. K3s itself is lightweight, but containers,
images, logs, and persistent volumes can grow over time.

## Environment variables

If deployment variable fields are available in your launch flow, use them there. Otherwise, provide
the same values through user data that writes `/etc/zmi/deploy.env`, or configure them after first
boot.

| Variable           | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `K3S_TOKEN`        | Shared secret used when adding nodes to the cluster         |
| `K3S_TLS_SANS`     | Comma-separated extra hostnames or IPs for the API cert     |
| `K3S_CLUSTER_CIDR` | Pod network CIDR. Defaults to the K3s standard if unset     |
| `K3S_SERVICE_CIDR` | Service network CIDR. Defaults to the K3s standard if unset |
| `K3S_NODE_NAME`    | Optional node name override                                 |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

First boot installs and configures K3s before disabling its setup service. Track progress:

```bash
sudo journalctl -u k3s-first-boot.service -f
```

### 3. Verify K3s is running

```bash
sudo systemctl status k3s --no-pager
sudo k3s kubectl get nodes
sudo k3s kubectl get pods -A
```

The node should show `Ready`, and the system pods should be running or completed.

### 4. Use kubectl on the VM

K3s includes its own `kubectl` wrapper:

```bash
sudo k3s kubectl get namespaces
sudo k3s kubectl get services -A
```

The cluster kubeconfig is stored at:

```text
/etc/rancher/k3s/k3s.yaml
```

## Remote kubectl access

To use `kubectl` from your workstation, copy the kubeconfig from the VM and replace the server
address with the VM address you can reach.

```bash
ssh ubuntu@<your-vm-ip> 'sudo cat /etc/rancher/k3s/k3s.yaml' > ./k3s.yaml
chmod 600 ./k3s.yaml
```

Then edit `./k3s.yaml` and change the server from `https://127.0.0.1:6443` to:

```text
https://<your-vm-ip>:6443
```

Use it with:

```bash
KUBECONFIG=./k3s.yaml kubectl get nodes
```

Only expose port `6443` to trusted IPs.

## Managing K3s

```bash
# Check service status
sudo systemctl status k3s --no-pager

# Restart K3s
sudo systemctl restart k3s

# View logs
sudo journalctl -u k3s -f

# Check version
k3s --version
```

Important paths:

| Path                        | Purpose                    |
| --------------------------- | -------------------------- |
| `/etc/rancher/k3s/k3s.yaml` | Cluster kubeconfig         |
| `/var/lib/rancher/k3s`      | K3s data and runtime state |

## Ports

| Port | Protocol | Purpose               |
| ---- | -------- | --------------------- |
| 22   | TCP      | SSH                   |
| 6443 | TCP      | Kubernetes API server |

Application ports depend on the workloads you deploy. Create ZCP network/firewall rules only for the
services you intentionally expose.

## Security

Protect `/etc/rancher/k3s/k3s.yaml`; it grants administrative access to the cluster. Do not expose
the Kubernetes API publicly to `0.0.0.0/0`. Restrict access to trusted IPs, a VPN, or a private
network.

This single-node K3s image is suitable for development, labs, and small workloads. For production,
plan for multi-node high availability, external backups, monitoring, and tested restore procedures.

## Next steps

- [K3s documentation](https://docs.k3s.io/)
- [Kubernetes documentation](https://kubernetes.io/docs/)

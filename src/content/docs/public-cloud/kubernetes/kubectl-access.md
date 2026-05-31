---
title: kubectl Access
sidebar_position: 3
---

## Accessing Your Cluster via kubectl

`kubectl` is the Kubernetes command-line tool. Use it to inspect, manage, and troubleshoot resources
in your cluster.

### Download your kubeconfig

- In the portal, go to your cluster's **Overview** page.
- Click **Download Config** to download the `kubeconfig` file.

### Download kubectl

ZSoftly Cloud Platform supports Kubernetes **1.34** and **1.35**. Install the `kubectl` version that
matches your cluster — Kubernetes requires client and server to be within one minor version of each
other.

The fastest way to install the latest compatible version:

**Linux / macOS:**

```bash
# Install latest stable kubectl
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
kubectl version --client
```

For macOS replace `linux` with `darwin` in the URL above.

**Windows (PowerShell):**

```powershell
curl.exe -LO "https://dl.k8s.io/release/v1.35.0/bin/windows/amd64/kubectl.exe"
```

**Or use a package manager:**

```bash
# macOS
brew install kubectl

# Linux (snap)
snap install kubectl --classic

# Windows (winget)
winget install Kubernetes.kubectl
```

For a specific version (e.g. to match a 1.34 cluster), replace
`$(curl -Ls https://dl.k8s.io/release/stable.txt)` with `v1.34.0`.

See the [official kubectl install guide](https://kubernetes.io/docs/tasks/tools/) for all options.

### Use kubectl with your kubeconfig

```bash
# List all pods
kubectl --kubeconfig /path/to/kube.conf get pods --all-namespaces

# List nodes
kubectl --kubeconfig /path/to/kube.conf get nodes

# List services
kubectl --kubeconfig /path/to/kube.conf get services --all-namespaces
```

To avoid specifying `--kubeconfig` every time:

```bash
export KUBECONFIG=/path/to/kube.conf
kubectl get nodes
```

See also: [Create Cluster](./create-cluster), [Dashboard Access](./dashboard-access)

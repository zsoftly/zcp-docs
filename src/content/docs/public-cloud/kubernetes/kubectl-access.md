---
title: kubectl Access
sidebar_position: 3
---

`kubectl` is the Kubernetes command-line tool. Use it to inspect, manage, and troubleshoot resources
in your cluster.

### Download your kubeconfig

- In the portal, go to your cluster's **Overview** page.
- Click **Download Config** to download the `kubeconfig` file.

### Download kubectl

ZSoftly Cloud Platform supports Kubernetes **1.34**, **1.35**, **1.36**, and **1.37**. New clusters
default to **1.36.4**. Install the `kubectl` version that matches your cluster's minor version.
Kubernetes requires client and server to be within one minor version of each other.

The examples use the current default version, 1.36.4. Replace the full version with a patched
version that matches your cluster's actual minor version.

**Linux / macOS:**

```bash
# Install kubectl 1.36.4
curl -LO "https://dl.k8s.io/release/v1.36.4/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
kubectl version --client
```

For macOS replace `linux` with `darwin` in the URL above.

**Windows (PowerShell):**

```powershell
curl.exe -LO "https://dl.k8s.io/release/v1.36.4/bin/windows/amd64/kubectl.exe"
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

Package-manager latest versions may not match your cluster's minor version. Check the
[version lifecycle](/public-cloud/kubernetes/create-cluster#version-lifecycle) and Kubernetes
[version-skew guidance](https://kubernetes.io/releases/version-skew-policy/) before installing one.

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

See also: [Create Cluster](/public-cloud/kubernetes/create-cluster),
[Dashboard Access](/public-cloud/kubernetes/dashboard-access)

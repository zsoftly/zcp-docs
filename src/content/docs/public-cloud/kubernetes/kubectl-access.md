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
default to **1.36.4**.

Install the latest stable `kubectl` release, and keep the client within one minor version of your
cluster. See the [version skew policy](https://kubernetes.io/releases/version-skew-policy/) for
details.

**Linux / macOS:**

```bash
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
kubectl version --client
```

For macOS replace `linux` with `darwin` in the URL above.

**Windows (PowerShell):**

```powershell
$version = (Invoke-WebRequest -Uri "https://dl.k8s.io/release/stable.txt" -UseBasicParsing).Content.Trim()
curl.exe -LO "https://dl.k8s.io/release/$version/bin/windows/amd64/kubectl.exe"
```

If your cluster runs an older minor version, replace the fetched version with a release from the
matching minor line. See the upstream install guides for full instructions per platform:
[Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/),
[macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/), and
[Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/).

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

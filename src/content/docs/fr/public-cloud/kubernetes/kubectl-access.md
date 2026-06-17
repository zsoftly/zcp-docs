---
title: Accès kubectl
sidebar_position: 3
---

`kubectl` est l'outil en ligne de commande de Kubernetes. Utilisez-le pour inspecter, gérer et
dépanner les ressources de votre cluster.

### Télécharger votre kubeconfig

- Dans le portail, accédez à la page **Overview** de votre cluster.
- Cliquez sur **Download Config** pour télécharger le fichier `kubeconfig`.

### Télécharger kubectl

ZSoftly Cloud Platform supports Kubernetes **1.34**, **1.35**, and **1.36** (current: **1.36.1**).
Installez la version de `kubectl` qui correspond à la version mineure de votre cluster. Kubernetes
exige que le client et le serveur soient à moins d'une version mineure l'un de l'autre.

La façon la plus rapide d'installer la dernière version compatible :

**Linux / macOS:**

```bash
# Install latest stable kubectl
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
kubectl version --client
```

Pour macOS, remplacez `linux` par `darwin` dans l'URL ci-dessus.

**Windows (PowerShell):**

```powershell
curl.exe -LO "https://dl.k8s.io/release/v1.36.0/bin/windows/amd64/kubectl.exe"
```

**Ou utilisez un gestionnaire de paquets :**

```bash
# macOS
brew install kubectl

# Linux (snap)
snap install kubectl --classic

# Windows (winget)
winget install Kubernetes.kubectl
```

Pour une version précise (par exemple pour correspondre à un cluster 1.34), remplacez
`$(curl -Ls https://dl.k8s.io/release/stable.txt)` par `v1.34.0`.

Consultez le [guide d'installation officiel de kubectl](https://kubernetes.io/docs/tasks/tools/)
pour toutes les options.

### Utiliser kubectl avec votre kubeconfig

```bash
# List all pods
kubectl --kubeconfig /path/to/kube.conf get pods --all-namespaces

# List nodes
kubectl --kubeconfig /path/to/kube.conf get nodes

# List services
kubectl --kubeconfig /path/to/kube.conf get services --all-namespaces
```

Pour éviter de préciser `--kubeconfig` à chaque commande :

```bash
export KUBECONFIG=/path/to/kube.conf
kubectl get nodes
```

Voir aussi : [Créer un cluster](/fr/public-cloud/kubernetes/create-cluster),
[Accès au tableau de bord](/fr/public-cloud/kubernetes/dashboard-access)

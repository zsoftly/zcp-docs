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

ZSoftly Cloud Platform prend en charge Kubernetes **1.34**, **1.35**, **1.36** et **1.37**. Les
nouveaux clusters utilisent par défaut la version **1.36.4**.

Installez la dernière version stable de `kubectl` et gardez le client à moins d'une version mineure
de votre cluster. Consultez la
[politique de dérive de version](https://kubernetes.io/releases/version-skew-policy/) pour plus de
détails.

**Linux / macOS:**

```bash
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
kubectl version --client
```

Pour macOS, remplacez `linux` par `darwin` dans l'URL ci-dessus.

**Windows (PowerShell):**

```powershell
$version = (Invoke-WebRequest -Uri "https://dl.k8s.io/release/stable.txt" -UseBasicParsing).Content.Trim()
curl.exe -LO "https://dl.k8s.io/release/$version/bin/windows/amd64/kubectl.exe"
```

Si votre cluster utilise une version mineure plus ancienne, remplacez la version récupérée par une
version de la ligne mineure correspondante. Consultez les guides d'installation officiels pour les
instructions complètes par plateforme :
[Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/),
[macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/) et
[Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/).

**Ou utilisez un gestionnaire de paquets :**

```bash
# macOS
brew install kubectl

# Linux (snap)
snap install kubectl --classic

# Windows (winget)
winget install Kubernetes.kubectl
```

Remplacez la version dans l'URL par celle qui correspond à votre cluster.

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

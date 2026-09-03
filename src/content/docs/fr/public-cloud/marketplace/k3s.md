---
title: K3s
---

K3s est une distribution Kubernetes légère empaquetée dans un seul binaire. Elle est conçue pour les
petits clusters, les environnements edge, le développement, les labs et les charges Kubernetes
simples qui n'ont pas besoin de toute la complexité opérationnelle d'une plateforme Kubernetes plus
lourde.

## Logiciels inclus

| Composant | Version     |
| --------- | ----------- |
| K3s       | 1.36.2+k3s1 |
| Ubuntu    | 24.04 LTS   |

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

Dimensionnez l'instance selon les charges que vous voulez exécuter. K3s est léger, mais les
conteneurs, images, journaux et volumes persistants peuvent grandir avec le temps.

## Variables d'environnement

Si des champs de variables de déploiement sont disponibles dans votre parcours de lancement,
utilisez-les à cet endroit. Sinon, fournissez les mêmes valeurs via un user data qui écrit
`/etc/zmi/deploy.env`, ou configurez-les après le premier démarrage.

| Variable           | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| `K3S_TOKEN`        | Secret partagé utilisé pour ajouter des nœuds au cluster             |
| `K3S_TLS_SANS`     | Noms d'hôte ou IP supplémentaires, séparés par des virgules          |
| `K3S_CLUSTER_CIDR` | CIDR du réseau de pods. Utilise la valeur K3s par défaut si vide     |
| `K3S_SERVICE_CIDR` | CIDR du réseau de services. Utilise la valeur K3s par défaut si vide |
| `K3S_NODE_NAME`    | Nom de nœud optionnel                                                |

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Le premier démarrage installe et configure K3s avant de désactiver son service de configuration.
Suivez la progression:

```bash
sudo journalctl -u k3s-first-boot.service -f
```

### 3. Vérifier que K3s fonctionne

```bash
sudo systemctl status k3s --no-pager
sudo k3s kubectl get nodes
sudo k3s kubectl get pods -A
```

Le nœud doit afficher `Ready`, et les pods système doivent être en cours d'exécution ou terminés.

### 4. Utiliser kubectl sur la VM

K3s inclut son propre wrapper `kubectl`:

```bash
sudo k3s kubectl get namespaces
sudo k3s kubectl get services -A
```

Le kubeconfig du cluster se trouve ici:

```text
/etc/rancher/k3s/k3s.yaml
```

## Accès kubectl distant

Pour utiliser `kubectl` depuis votre poste, copiez le kubeconfig depuis la VM et remplacez l'adresse
du serveur par l'adresse de la VM que vous pouvez joindre.

```bash
ssh ubuntu@<your-vm-ip> 'sudo cat /etc/rancher/k3s/k3s.yaml' > ./k3s.yaml
chmod 600 ./k3s.yaml
```

Modifiez ensuite `./k3s.yaml` et changez le serveur de `https://127.0.0.1:6443` vers:

```text
https://<your-vm-ip>:6443
```

Utilisez-le avec:

```bash
KUBECONFIG=./k3s.yaml kubectl get nodes
```

N'exposez le port `6443` qu'à des adresses IP de confiance.

## Gérer K3s

```bash
# Vérifier l'état du service
sudo systemctl status k3s --no-pager

# Redémarrer K3s
sudo systemctl restart k3s

# Voir les journaux
sudo journalctl -u k3s -f

# Vérifier la version
k3s --version
```

Chemins importants:

| Chemin                      | Rôle                            |
| --------------------------- | ------------------------------- |
| `/etc/rancher/k3s/k3s.yaml` | Kubeconfig du cluster           |
| `/var/lib/rancher/k3s`      | Données K3s et état d'exécution |

## Ports

| Port | Protocole | Rôle                  |
| ---- | --------- | --------------------- |
| 22   | TCP       | SSH                   |
| 6443 | TCP       | API server Kubernetes |

Les ports applicatifs dépendent des charges que vous déployez. Créez des règles réseau/pare-feu ZCP
uniquement pour les services que vous exposez volontairement.

## Sécurité

Protégez `/etc/rancher/k3s/k3s.yaml`; il donne un accès administrateur au cluster. N'exposez pas
l'API Kubernetes publiquement à `0.0.0.0/0`. Limitez l'accès à des IPs de confiance, un VPN ou un
réseau privé.

Cette image K3s à nœud unique convient au développement, aux labs et aux petites charges. Pour la
production, prévoyez une haute disponibilité multi-nœuds, des sauvegardes externes, de la
surveillance et des procédures de restauration testées.

## Prochaines étapes

- [Documentation K3s](https://docs.k3s.io/)
- [Documentation Kubernetes](https://kubernetes.io/docs/)

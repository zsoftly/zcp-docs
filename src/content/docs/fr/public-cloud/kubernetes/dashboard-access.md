---
title: Accès au tableau de bord
sidebar_position: 4
---

## Accès à l'interface Web du tableau de bord Kubernetes

Le tableau de bord Kubernetes est une interface Web permettant de gérer et de surveiller votre
cluster.

### Lancer un proxy local

```bash
kubectl --kubeconfig /path/to/kube.conf proxy
```

Cette commande démarre un serveur local à l'adresse `http://localhost:8001`.

### Ouvrir le tableau de bord

```
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

### Créer un jeton de connexion

Depuis Kubernetes v1.24, les jetons ne sont pas générés automatiquement. Créez-en un :

```yaml
apiVersion: v1
kind: Secret
type: kubernetes.io/service-account-token
metadata:
  name: kubernetes-dashboard-token
  namespace: kubernetes-dashboard
  annotations:
    kubernetes.io/service-account.name: kubernetes-dashboard-admin-user
```

Appliquez-le :

```bash
kubectl --kubeconfig /path/to/kube.conf apply -f token.yaml
```

### Récupérer le jeton

```bash
kubectl --kubeconfig /path/to/kube.conf describe secret \
  $(kubectl --kubeconfig /path/to/kube.conf get secrets -n kubernetes-dashboard \
    | grep kubernetes-dashboard-token | awk '{print $1}') \
  -n kubernetes-dashboard
```

Pour plus de détails, consultez la
[documentation officielle du tableau de bord Kubernetes](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/).

Voir aussi : [Créer un cluster](/fr/public-cloud/kubernetes/create-cluster),
[Accès kubectl](/fr/public-cloud/kubernetes/kubectl-access)

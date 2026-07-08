---
title: Dashboard Access
sidebar_position: 4
---

## Kubernetes Dashboard UI Access

The Kubernetes Dashboard is a web-based UI for managing and monitoring your cluster.

### Run a local proxy

```bash
kubectl --kubeconfig /path/to/kube.conf proxy
```

This starts a local server at `http://localhost:8001`.

### Open the Dashboard

```text
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

### Create a login token

Since Kubernetes v1.24, tokens are not auto-generated. Create one:

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

Apply it:

```bash
kubectl --kubeconfig /path/to/kube.conf apply -f token.yaml
```

### Retrieve the token

```bash
kubectl --kubeconfig /path/to/kube.conf describe secret \
  $(kubectl --kubeconfig /path/to/kube.conf get secrets -n kubernetes-dashboard \
    | grep kubernetes-dashboard-token | awk '{print $1}') \
  -n kubernetes-dashboard
```

For more details, see the
[official Kubernetes Dashboard documentation](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/).

See also: [Create Cluster](/public-cloud/kubernetes/create-cluster),
[kubectl Access](/public-cloud/kubernetes/kubectl-access)

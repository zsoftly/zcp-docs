---
title: Accessing CloudStack
sidebar_position: 2
---

# Accessing Apache CloudStack

Your private cloud's CloudStack management interface is the primary control plane for your
infrastructure.

## Management UI

The CloudStack UI is available at the URL provided in your credentials document, typically:

```
http://<management-server-ip>:8080/client
```

or over HTTPS if TLS is configured:

```
https://<management-server-hostname>/client
```

Log in with the admin credentials from your handover document.

## Change the admin password

Immediately after first login:

1. Click the **Account** icon (top right)
2. Select **Change Password**
3. Set a strong password and save it securely

## API access

CloudStack exposes a native API:

```
http://<management-server-ip>:8080/client/api
```

See the [Apache CloudStack API documentation](https://cloudstack.apache.org/api.html) for the full
reference.

## Supported clients

- **CloudStack UI**: web browser, no installation required
- **cmk**: CloudStack management CLI (Go binary v6.5.0): see
  [Apache CloudStack reference](../../reference/apache-cloudstack) for install and configure steps
- **Terraform**: via the
  [CloudStack provider](https://registry.terraform.io/providers/cloudstack/cloudstack/latest)
- **Ansible**: via the
  [CloudStack collection](https://docs.ansible.com/ansible/latest/collections/ngine_io/cloudstack/)

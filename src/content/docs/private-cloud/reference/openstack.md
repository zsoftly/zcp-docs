---
title: OpenStack
sidebar_position: 2
---

# OpenStack Reference

OpenStack is the alternative cloud orchestration platform for ZSoftly Private Cloud, fully supported
alongside Apache CloudStack. Where your environment runs OpenStack, orchestration concepts map to
OpenStack's projects, services, and APIs.

## Version

Your credentials document specifies the exact OpenStack release deployed in your environment.

## Official documentation

| Resource              | URL                                                       |
| --------------------- | --------------------------------------------------------- |
| Documentation home    | https://docs.openstack.org                                |
| Installation Guides   | https://docs.openstack.org/install-guide/                 |
| Administrator Guides  | https://docs.openstack.org/admin/                         |
| CLI (OpenStackClient) | https://docs.openstack.org/python-openstackclient/latest/ |
| API Reference         | https://docs.openstack.org/api-quick-start/               |
| Releases              | https://releases.openstack.org                            |

ZSoftly does not maintain a mirror of OpenStack documentation. The official documentation above is
authoritative.

## OpenStackClient (osc)

`openstack` is the official unified CLI.

### Install

```bash
pip install python-openstackclient
openstack --version
```

Use a virtualenv or `pipx` to keep it isolated from system Python.

### Configure

Authenticate with a `clouds.yaml` or an `openrc` file. Your auth URL, project, and credentials are
in the credentials document provided at handover.

`clouds.yaml` (in `~/.config/openstack/` or the working directory):

```yaml
clouds:
  zsoftly:
    auth:
      auth_url: https://<your-keystone-endpoint>:5000/v3
      username: <your-username>
      password: <your-password>
      project_name: <your-project>
      user_domain_name: Default
      project_domain_name: Default
    region_name: <your-region>
    interface: public
    identity_api_version: 3
```

```bash
export OS_CLOUD=zsoftly
```

Alternatively, download an RC file from Horizon (**Project → API Access → Download OpenStack RC
File**) and `source` it.

### Verify

```bash
openstack token issue
openstack catalog list
```

### Usage examples

```bash
openstack server list
openstack network list
openstack image list
openstack flavor list
```

## Horizon dashboard

Horizon is OpenStack's web UI. Its URL is in your credentials document; download CLI credentials
from **Project → API Access**.

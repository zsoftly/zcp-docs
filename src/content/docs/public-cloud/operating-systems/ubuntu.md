---
title: Ubuntu
description:
  Deploy Ubuntu Server LTS on ZCP, including available versions, default login, SSH and password
  access, first-boot setup, and links to Canonical's official documentation.
---

ZCP offers maintained **Ubuntu Server LTS** images across every region. Each image ships with the
paravirtual drivers and guest agent for fast I/O and clean management, and sets a unique hostname
and administrator credential on first boot. Ubuntu is free and open-source, with no license or
activation required.

For how all ZCP images behave on first boot, see
[Operating System Images](/public-cloud/operating-systems/).

## Available versions

ZCP tracks the Ubuntu **Long-Term Support (LTS)** releases. Pick the newest version unless an
application pins you to an older one. Each LTS gets **5 years of standard security maintenance**
from Canonical, extendable to **10 years** with Expanded Security Maintenance (ESM) under Ubuntu
Pro.

| Version          | Codename         | Status       | End of standard support        |
| ---------------- | ---------------- | ------------ | ------------------------------ |
| Ubuntu 26.04 LTS | Resolute Raccoon | ✅ Available | April 2031 (ESM to 2036)       |
| Ubuntu 24.04 LTS | Noble Numbat     | ✅ Available | April 2029 (ESM to 2034)       |
| Ubuntu 22.04 LTS | Jammy Jellyfish  | ✅ Available | April 2027 (ESM to 2032)       |
| Ubuntu 20.04 LTS | Focal Fossa      | ✅ Available | Ended April 2025 (ESM to 2030) |

:::caution

Ubuntu 20.04 LTS reached end of standard support in April 2025. It now receives security updates
only through Ubuntu Pro ESM. Deploy 22.04 or newer for new workloads. End-of-life dates are set by
Canonical. Confirm on the [Ubuntu release cycle](https://ubuntu.com/about/release-cycle) page.

:::

## Use cases

Ubuntu Server is the most widely deployed Linux in the cloud and the default choice for new Linux
workloads on ZCP:

- **Web and application hosting**: Nginx, Apache, Node.js, Python/Django, PHP/Laravel, Ruby on
  Rails, and Java/Spring application servers.
- **Containers and Kubernetes**: Docker and containerd hosts, and Kubernetes control-plane or worker
  nodes. This is the standard base for cloud-native CI/CD runners.
- **Databases and data**: PostgreSQL, MySQL/MariaDB, MongoDB, Redis/Valkey, and analytics or
  data-pipeline workloads.
- **DevOps and automation**: Jenkins, GitLab runners, Ansible/Terraform control nodes, and build and
  packaging servers.
- **AI/ML and GPU workloads**: TensorFlow, PyTorch, and CUDA toolchains run on Ubuntu's
  well-supported driver stack.
- **Edge, IoT, and development**: reproducible dev environments, microservices, and lightweight edge
  gateways.
- **One-click apps**: Ubuntu is the base for most [Marketplace](/public-cloud/marketplace/) images,
  so anything deployed there runs on the same OS you get here.

## Default login

The default user is **`ubuntu`**, with `sudo` for administration. Sign in over
[SSH](/public-cloud/compute/connect-ssh/) with the key you attached at create time, or with the
portal-generated password.

```bash
ssh ubuntu@<your-instance-ip>
```

## Deploy an Ubuntu instance

1. Go to **Compute → Create Instance** (see
   [Create Instance](/public-cloud/compute/create-instance/)).
2. Choose an **Ubuntu** image and the version you want.
3. Pick a region and a [plan](/public-cloud/compute/instance-types/), and attach an SSH key.
4. Attach to a network and create the instance.

## Recommended first steps

- Update packages: `sudo apt update && sudo apt upgrade -y`.
- Confirm SSH key access works, then disable password login if you only use keys.
- Lock down access with a [firewall rule](/public-cloud/compute/settings/firewall/).

## Ubuntu documentation

For administration, packages, and release details, see the official Canonical documentation:

- [Ubuntu Server documentation](https://documentation.ubuntu.com/server/)
- [Ubuntu releases and lifecycle](https://ubuntu.com/about/release-cycle)

## Good to know

- **Snapshots and backups** work with the guest agent installed. See
  [VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots/) and
  [Backups](/public-cloud/backups-snapshots/backups/).
- Need a different Linux family? See [Rocky Linux](/public-cloud/operating-systems/rocky-linux/),
  [AlmaLinux](/public-cloud/operating-systems/alma-linux/), or
  [Oracle Linux](/public-cloud/operating-systems/oracle-linux/).

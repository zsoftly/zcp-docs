---
title: Rocky Linux
description:
  Deploy Rocky Linux on ZCP, including available versions, default login, SSH access, first-boot
  setup, and links to the official Rocky Linux documentation.
---

ZCP offers a maintained **Rocky Linux** image in every region. Rocky Linux is a community,
enterprise-grade Linux that is binary-compatible with Red Hat Enterprise Linux (RHEL). It is a
drop-in choice for RHEL-targeted workloads. It is free and open-source. No license or activation is
required.

For how all ZCP images behave on first boot, see
[Operating System Images](/public-cloud/operating-systems/).

## Available versions

Rocky Linux follows the RHEL release cadence and lifecycle. Each major release gets roughly 10 years
of support.

| Version       | Status       | End of life |
| ------------- | ------------ | ----------- |
| Rocky Linux 9 | ✅ Available | 2032-05-31  |

End-of-life dates are set by the Rocky Enterprise Software Foundation. Confirm on the
[Rocky Linux version guide](https://wiki.rockylinux.org/rocky/version/).

## Use cases

Rocky Linux is the community successor to CentOS and a free, bug-for-bug RHEL-compatible base, ideal
when you want enterprise Linux without subscription costs:

- **RHEL-compatible production servers**: run RHEL-targeted software unchanged, with the same
  packages, SELinux policies, and `dnf`/`yum` tooling.
- **CentOS migration target**: a drop-in replacement for end-of-life CentOS 7/8 deployments.
- **Enterprise application hosting**: SAP, Oracle Database, JBoss/WildFly, and other certified
  enterprise workloads that expect a RHEL-family OS.
- **Web and database servers**: Nginx, Apache, PostgreSQL, MariaDB, and MySQL on a long-lived,
  stable base.
- **Containers and virtualization**: Podman, Docker, and Kubernetes nodes. KVM hosts use the
  RHEL-family virtualization stack.
- **HPC and scientific computing**: a common, reproducible base for compute clusters and research
  pipelines.
- **Compliance-sensitive workloads**: predictable 10-year lifecycle and CIS/STIG hardening guidance
  for regulated environments.

## Default login

The default user is **`rocky`**, with `sudo` for administration. Sign in over
[SSH](/public-cloud/compute/connect-ssh/) with the key you attached at create time, or with the
portal-generated password.

```bash
ssh rocky@<your-instance-ip>
```

## Deploy a Rocky Linux instance

1. Go to **Compute → Create Instance** (see
   [Create Instance](/public-cloud/compute/create-instance/)).
2. Choose the **Rocky Linux** image.
3. Pick a region and a [plan](/public-cloud/compute/instance-types/), and attach an SSH key.
4. Attach to a network and create the instance.

## Recommended first steps

- Update packages: `sudo dnf upgrade -y`.
- Confirm SSH key access, then lock down access with a
  [firewall rule](/public-cloud/compute/settings/firewall/).

## Rocky Linux documentation

- [Rocky Linux documentation](https://docs.rockylinux.org/)

## Good to know

- **Snapshots and backups** work with the guest agent installed. See
  [VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots/) and
  [Backups](/public-cloud/backups-snapshots/backups/).
- Other RHEL-compatible options: [AlmaLinux](/public-cloud/operating-systems/alma-linux/) and
  [Oracle Linux](/public-cloud/operating-systems/oracle-linux/).

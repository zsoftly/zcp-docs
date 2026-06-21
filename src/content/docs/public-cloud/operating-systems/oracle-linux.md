---
title: Oracle Linux
description:
  Deploy Oracle Linux on ZCP, including available versions, default login, SSH access, first-boot
  setup, and links to the official Oracle Linux documentation.
---

ZCP offers a maintained **Oracle Linux** image in every region. Oracle Linux is an enterprise-grade
Linux that is binary-compatible with Red Hat Enterprise Linux (RHEL) and ships with a choice of the
Red Hat Compatible Kernel or Oracle's Unbreakable Enterprise Kernel (UEK). The image itself is free
to download and use. No activation is required.

For how all ZCP images behave on first boot, see
[Operating System Images](/public-cloud/operating-systems/).

## Available versions

Oracle Linux follows Oracle's Lifetime Support Policy: about 10 years of Premier Support per major
release, with Extended Support and then indefinite Sustaining Support beyond it.

| Version        | Status       | End of Premier Support            |
| -------------- | ------------ | --------------------------------- |
| Oracle Linux 9 | ✅ Available | 2032 (Extended/Sustaining beyond) |

Support dates are set by Oracle. Confirm in the
[Oracle Lifetime Support Policy](https://www.oracle.com/a/ocom/docs/elsp-lifetime-069338.pdf).

## Use cases

Oracle Linux is a free, RHEL-compatible distribution from Oracle, with an optional high-performance
**Unbreakable Enterprise Kernel (UEK)** and built-in **Ksplice** zero-downtime patching:

- **Oracle Database and middleware**: the native, fully supported OS for Oracle Database, WebLogic,
  and the Oracle E-Business Suite.
- **RHEL-compatible enterprise servers**: run RHEL-family software unchanged, choosing the Red Hat
  Compatible Kernel or UEK for newer kernel features and performance.
- **Zero-downtime patching**: Ksplice applies kernel and critical userspace updates without
  rebooting, ideal for high-availability services.
- **Web and database hosting**: Nginx, Apache, MySQL (Oracle's own), PostgreSQL, and MariaDB on a
  long-lived base.
- **Containers and cloud-native**: Podman, Docker, and Kubernetes (including Oracle's container
  services) on a supported host OS.
- **Migrations**: a straightforward target for moving off CentOS or other RHEL-family distributions,
  with Oracle's free `centos2ol` conversion script.
- **Enterprise and regulated workloads**: predictable lifecycle plus CIS/STIG hardening for
  compliance-sensitive environments.

## Default login

The default user is **`cloud-user`**, with `sudo` for administration. Sign in over
[SSH](/public-cloud/compute/connect-ssh/) with the key you attached at create time, or with the
portal-generated password. Confirm the exact user shown for the image in the portal.

```bash
ssh cloud-user@<your-instance-ip>
```

## Deploy an Oracle Linux instance

1. Go to **Compute → Create Instance** (see
   [Create Instance](/public-cloud/compute/create-instance/)).
2. Choose the **Oracle Linux** image.
3. Pick a region and a [plan](/public-cloud/compute/instance-types/), and attach an SSH key.
4. Attach to a network and create the instance.

## Recommended first steps

- Update packages: `sudo dnf upgrade -y`.
- Confirm SSH key access, then lock down access with a
  [firewall rule](/public-cloud/compute/settings/firewall/).

## Oracle Linux documentation

- [Oracle Linux documentation](https://docs.oracle.com/en/operating-systems/oracle-linux/)

## Good to know

- **Snapshots and backups** work with the guest agent installed. See
  [VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots/) and
  [Backups](/public-cloud/backups-snapshots/backups/).
- Other RHEL-compatible options: [Rocky Linux](/public-cloud/operating-systems/rocky-linux/) and
  [AlmaLinux](/public-cloud/operating-systems/alma-linux/).

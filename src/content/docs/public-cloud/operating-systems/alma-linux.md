---
title: AlmaLinux
description:
  Deploy AlmaLinux on ZCP, including available versions, default login, SSH access, first-boot
  setup, and links to the official AlmaLinux documentation.
---

ZCP offers a maintained **AlmaLinux** image in every region. AlmaLinux is a community-owned,
enterprise-grade Linux that is 1:1 binary-compatible with Red Hat Enterprise Linux (RHEL). It is
free and open-source. No license or activation is required.

For how all ZCP images behave on first boot, see
[Operating System Images](/public-cloud/operating-systems/).

## Available versions

AlmaLinux mirrors the RHEL release cadence and lifecycle, with roughly 10 years of support per major
release.

| Version     | Status       | End of life                            |
| ----------- | ------------ | -------------------------------------- |
| AlmaLinux 9 | ✅ Available | 2032-05-31 (active support to 2027-05) |

End-of-life dates are set by the AlmaLinux OS Foundation. Confirm on the
[AlmaLinux release notes](https://wiki.almalinux.org/release-notes/).

## Use cases

AlmaLinux is a free, 1:1 binary-compatible RHEL rebuild, community-owned and governed by a
non-profit foundation. It gives you a stable enterprise base with no subscription:

- **RHEL-compatible production servers**: run RHEL-certified software unchanged, with identical
  packages, SELinux policies, and `dnf` tooling.
- **CentOS replacement**: a popular, well-supported migration path off end-of-life CentOS, with the
  ELevate tool for in-place upgrades.
- **Enterprise application hosting**: SAP, Oracle Database, and Java application servers that target
  the RHEL ecosystem.
- **Web and database servers**: Nginx, Apache, PostgreSQL, MariaDB, and MySQL on a long-lived base.
- **Containers and DevOps**: Podman, Docker, and Kubernetes nodes. CI/CD build and runner hosts.
- **Cloud and hosting fleets**: a predictable, security-maintained base for fleets that need a
  10-year lifecycle.
- **Regulated workloads**: CIS Benchmark and STIG hardening guidance for compliance-sensitive
  environments.

## Default login

The default user is **`almalinux`**, with `sudo` for administration. Sign in over
[SSH](/public-cloud/compute/connect-ssh/) with the key you attached at create time, or with the
portal-generated password.

```bash
ssh almalinux@<your-instance-ip>
```

## Deploy an AlmaLinux instance

1. Go to **Compute → Create Instance** (see
   [Create Instance](/public-cloud/compute/create-instance/)).
2. Choose the **AlmaLinux** image.
3. Pick a region and a [plan](/public-cloud/compute/instance-types/), and attach an SSH key.
4. Attach to a network and create the instance.

## Recommended first steps

- Update packages: `sudo dnf upgrade -y`.
- Confirm SSH key access, then lock down access with a
  [firewall rule](/public-cloud/compute/settings/firewall/).

## AlmaLinux documentation

- [AlmaLinux documentation](https://wiki.almalinux.org/)

## Good to know

- **Snapshots and backups** work with the guest agent installed. See
  [VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots/) and
  [Backups](/public-cloud/backups-snapshots/backups/).
- Other RHEL-compatible options: [Rocky Linux](/public-cloud/operating-systems/rocky-linux/) and
  [Oracle Linux](/public-cloud/operating-systems/oracle-linux/).

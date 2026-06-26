---
title: Operating System Images
description:
  How ZCP operating system images work, including maintained base images, first-boot setup, access
  and passwords, and the full catalog of Linux and Windows images with links to each.
---

ZCP **operating system images** are the base images you start an instance from. ZSoftly builds and
maintains every image, rebuilds and re-validates it for each release, and tunes it to boot fast and
run cleanly on the platform.

This is different from the [Marketplace](/public-cloud/marketplace/), where each image is an
**application** (WordPress, GitLab, a database, …) pre-installed and auto-configured on top of
Ubuntu. Use an OS image when you want a clean operating system to build on. Use a Marketplace image
when you want a ready-to-run app.

## How ZCP images work

Every OS image, Linux or Windows, behaves the same way on first boot:

- **Maintained base**: ZSoftly builds each image from the vendor's official release and adds the
  paravirtual drivers and a guest agent for fast I/O, graceful shutdown/reboot, and
  application-consistent VM snapshots. Each image is validated before publishing.
- **First-boot setup**: the image sets a unique hostname and a unique administrator credential per
  instance automatically, so no two instances ship with the same password.
- **Access**: Linux images accept an **SSH key** (recommended) or a portal-generated password.
  Windows images use **RDP** with an auto-generated administrator password. Regenerate the password
  from the portal at any time (it applies after the next reboot).
- **Right-sized**: pick any [plan](/public-cloud/compute/instance-types/) that meets the image's
  needs. Linux runs comfortably on the smallest plans, Windows needs at least 4 GB RAM and 2 vCPUs.

For the end-to-end deploy flow, see [Create Instance](/public-cloud/compute/create-instance/). To
switch an existing instance to a different image, see
[Change OS](/public-cloud/compute/settings/change-os/).

## Default login user

Each image has a default administrative user. Confirm the exact name in the portal when you create
the instance.

| Image        | Default user    | Connect with                              |
| ------------ | --------------- | ----------------------------------------- |
| Ubuntu       | `ubuntu`        | [SSH](/public-cloud/compute/connect-ssh/) |
| Rocky Linux  | `rocky`         | [SSH](/public-cloud/compute/connect-ssh/) |
| AlmaLinux    | `almalinux`     | [SSH](/public-cloud/compute/connect-ssh/) |
| Oracle Linux | `cloud-user`    | [SSH](/public-cloud/compute/connect-ssh/) |
| Windows      | `Administrator` | [RDP](/public-cloud/compute/connect-rdp/) |

Every instance also has a browser-based **VNC** console for access without SSH or RDP, useful for
first boot and troubleshooting. See [Console Access](/public-cloud/compute/console-access/).

## Catalog

### Linux

Free and open-source, with no license or activation required.

| Image                                                         | Versions available             | Status       |
| ------------------------------------------------------------- | ------------------------------ | ------------ |
| [Ubuntu](/public-cloud/operating-systems/ubuntu/)             | 26.04, 24.04, 22.04, 20.04 LTS | ✅ Available |
| [Rocky Linux](/public-cloud/operating-systems/rocky-linux/)   | 9                              | ✅ Available |
| [AlmaLinux](/public-cloud/operating-systems/alma-linux/)      | 9                              | ✅ Available |
| [Oracle Linux](/public-cloud/operating-systems/oracle-linux/) | 9                              | ✅ Available |

### Windows

Licensed **bring-your-own-license (BYOL)**. You supply and activate your own license.

| Image                                                             | Editions / versions        | Status       |
| ----------------------------------------------------------------- | -------------------------- | ------------ |
| [Windows Server](/public-cloud/operating-systems/windows-server/) | 2022 Standard, 2025 Std/DC | ✅ Available |
| [Windows Server](/public-cloud/operating-systems/windows-server/) | 2022 Datacenter            | 🚧 Pending   |
| [Windows 11 Pro](/public-cloud/operating-systems/windows-11/)     | 11 Pro                     | ✅ Available |

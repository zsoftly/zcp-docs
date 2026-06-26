---
title: Windows Server
description:
  Windows Server on ZCP, including available and upcoming editions (2022 and 2025, Standard and
  Datacenter), what each edition is for, bring-your-own-license activation, first sign-in steps, and
  links to Microsoft's official documentation.
---

ZCP **Windows Server** images ship with the paravirtual drivers and guest agent needed for good
performance and clean management, and set a unique administrator password on first boot for
immediate sign-in.

Windows Server is licensed **bring-your-own-license (BYOL)**. The images are not activated, and you
supply your own valid Windows Server license. See
[Licensing](#licensing-bring-your-own-license-byol) below.

:::tip

**Windows Server is available under BYOL:** 2025 in both Standard and Datacenter, plus 2022
Standard. Windows Server 2022 Datacenter is still in preparation.

:::

## Availability

ZCP offers the Windows Server lineup across the **2022** and **2025** releases in the **Standard**
and **Datacenter** editions.

| Version             | Edition    | Status       |
| ------------------- | ---------- | ------------ |
| Windows Server 2025 | Standard   | ✅ Available |
| Windows Server 2025 | Datacenter | ✅ Available |
| Windows Server 2022 | Standard   | ✅ Available |
| Windows Server 2022 | Datacenter | 🚧 Pending   |

## Editions: Standard vs Datacenter

Both editions share the same core Windows Server operating system, roles, and management tooling.
The difference is virtualization rights and the advanced software-defined datacenter features.

| Capability                          | Standard              | Datacenter                 |
| ----------------------------------- | --------------------- | -------------------------- |
| Core OS, roles, and features        | Full                  | Full                       |
| Virtualization rights (per license) | Limited (low-density) | High-density / unlimited\* |
| Storage Spaces Direct (S2D)         | Not included          | ✅                         |
| Software-Defined Networking (SDN)   | Not included          | ✅                         |
| Shielded VMs / Host Guardian        | Not included          | ✅                         |

\* Datacenter's broad virtualization rights are a licensing benefit tied to the physical host.
Confirm how your entitlement applies to hosted/cloud instances with Microsoft or your reseller.

## Use cases

### Windows Server 2022 Standard

The default choice for most Windows workloads:

- **Active Directory** domain controllers, DNS, and DHCP for a Windows environment.
- **File and print** servers, including DFS and Storage Replica for branch/HQ data.
- **IIS web and application** hosting, .NET application servers, and middleware.
- **Database hosting** (e.g. SQL Server) for line-of-business applications.
- General-purpose, low-density server roles where you run one workload per instance.

### Windows Server 2022 Datacenter (Pending)

Standard's full feature set plus the software-defined datacenter capabilities:

- **High-density virtualization** where many Windows Server guests run on the same licensed host.
- **Hyperconverged infrastructure** using Storage Spaces Direct (S2D) for software-defined storage.
- **Software-Defined Networking** with the Network Controller for micro-segmentation and policy.
- **Shielded VMs** for hardened, encrypted guest workloads in regulated environments.

### Windows Server 2025 Standard

The same role coverage as 2022 Standard, on the newest Long-Term Servicing Channel release:

- New workloads that should start on the **latest LTSC** for the longest support runway.
- Modern file access with **SMB over QUIC** for secure access without a VPN.
- Reduced reboots via **hotpatching** to keep services available during updates.
- Improved Active Directory, security defaults, and management experience.

### Windows Server 2025 Datacenter

The 2025 feature set plus every Datacenter capability:

- **Hyperconverged and software-defined datacenter** builds on the latest release.
- **GPU partitioning** and advanced virtualization for AI/graphics and dense consolidation.
- The longest support runway for **software-defined storage and networking** estates.

## Licensing: bring your own license (BYOL)

Windows Server images are provided **without a license**. ZCP does not include or sell a Windows
Server license with the instance. You must provide and activate your own. Until you activate, the
instance runs as an unactivated copy of Windows Server but is otherwise fully usable.

:::caution

You are responsible for holding a valid Windows Server license (and any required CALs) whose terms
permit use on hosted or cloud infrastructure, and for keeping that license compliant. Edition rights
(Standard vs Datacenter) and virtualization entitlements differ. Confirm your entitlement with
Microsoft or your reseller before relying on a Windows instance for production.

:::

### Activate after first sign-in

Sign in (see [First sign-in](#first-sign-in)), then activate with whichever method matches your
license, from an elevated PowerShell:

- **Retail / MAK key**

  ```powershell
  slmgr /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
  slmgr /ato
  ```

- **Volume licensing (KMS)**: point the instance at your KMS host:

  ```powershell
  slmgr /skms your-kms-host:1688
  slmgr /ato
  ```

Confirm activation with `slmgr /xpr`.

## Deploy a Windows Server instance

1. Go to **Compute → Create Instance** (see
   [Create Instance](/public-cloud/compute/create-instance/)).
2. Choose a **Windows Server** image. Available editions: Windows Server 2025 (Standard and
   Datacenter) and Windows Server 2022 Standard. Windows Server 2022 Datacenter is in preparation.
3. Pick a region and a plan. Windows Server needs at least **4 GB RAM and 2 vCPUs**. Size the plan
   for your workload, not the minimum.
4. Attach to a network and create the instance.

## First sign-in

1. Open your instance and retrieve its **auto-generated admin password** from the portal (the image
   sets a unique password per instance on first boot).
2. Connect with **Remote Desktop (RDP)** to the instance's public IP. See
   [Connect via RDP](/public-cloud/compute/connect-rdp/), or use
   [Console Access](/public-cloud/compute/console-access/) from the portal.
3. Sign in as **`Administrator`** with that password.

:::tip

Regenerate the admin password from the portal at any time. The new password applies after the next
reboot. Keep RDP locked down with a [firewall rule](/public-cloud/compute/settings/firewall/) that
allows port 3389 only from your own IPs.

:::

## Recommended first steps

- **Activate Windows Server** with your license (see
  [Licensing](#licensing-bring-your-own-license-byol)).
- Change the `Administrator` password to one only you know.
- Set the time zone and run **Windows Update**.
- Add only the server roles and features you need.

## Microsoft documentation

For Windows Server administration, roles and features, editions, licensing, and security guidance,
see the official Microsoft documentation:

- [Windows Server documentation](https://learn.microsoft.com/en-us/windows-server/)
- [Windows Server 2025 documentation](https://learn.microsoft.com/en-us/windows-server/get-started/whats-new-windows-server-2025)
- [Compare Standard and Datacenter editions](https://learn.microsoft.com/en-us/windows-server/get-started/editions-comparison-windows-server-2022)
- [Windows Server 2022 licensing](https://learn.microsoft.com/en-us/windows-server/get-started/windows-server-2022-licensing)

## Good to know

- **Snapshots and backups** work with the guest agent installed. See
  [VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots/) and
  [Backups](/public-cloud/backups-snapshots/backups/).
- Images are rebuilt and re-validated for each release. Existing instances are unaffected.
- For a desktop client OS, see [Windows 11 Pro](/public-cloud/operating-systems/windows-11/).
- For the full image catalog, see [Operating System Images](/public-cloud/operating-systems/).

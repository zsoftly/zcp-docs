---
title: Windows 11 Pro
description:
  Deploy a Windows 11 Pro instance on ZCP, including what the image includes, bring-your-own-license
  activation, and first-login steps.
---

ZCP offers a **Windows 11 Pro (64-bit)** image, available in every region. It boots with the
firmware Windows 11 requires (UEFI Secure Boot and a TPM 2.0 device) and ships with the drivers and
agents needed for good performance and clean management. On first boot it sets a unique
administrator password for immediate sign-in.

Windows 11 is licensed **bring-your-own-license (BYOL)**. The image is not activated, and you supply
your own valid Windows 11 license. See [Licensing](#licensing-bring-your-own-license-byol) below.

:::tip

**Windows 11 Pro is validated and available** in every region.

:::

## What's included

| Component           | Detail                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Operating system    | Windows 11 Pro, 64-bit                                           |
| Firmware            | UEFI + Secure Boot + TPM 2.0 (meets Windows 11 requirements)     |
| Paravirtual drivers | Pre-installed for fast disk and network I/O                      |
| Guest agent         | Graceful shutdown/reboot and application-consistent VM snapshots |
| First-boot setup    | Sets a unique admin password and the hostname automatically      |
| Regions             | Montréal and Ottawa                                              |
| Activation          | Not activated. Bring your own license (BYOL)                     |

Because the TPM and Secure Boot are present, features such as BitLocker drive encryption and Windows
Hello are available once you activate Windows.

## Licensing: bring your own license (BYOL)

The Windows 11 Pro image is provided **without a license**. ZCP does not include or sell a Windows
client license with the instance. You must provide and activate your own. Until you activate, the
instance runs as an unactivated copy of Windows (a desktop watermark appears and some
personalization settings are locked), but it is otherwise fully usable.

:::caution

You are responsible for holding a valid Windows 11 license whose terms permit use on hosted or cloud
infrastructure, and for keeping that license compliant. Confirm your entitlement with Microsoft or
your reseller before relying on a Windows instance for production.

:::

### Activate after first sign-in

Sign in (see [First login](#first-login)), then activate with whichever method matches your license:

- **Retail / OEM product key**: Settings → System → Activation → Change product key, or from an
  elevated PowerShell:

  ```powershell
  slmgr /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
  slmgr /ato
  ```

- **Volume licensing (MAK)**: enter your MAK key the same way (`slmgr /ipk` then `slmgr /ato`).
- **Volume licensing (KMS)**: point the instance at your KMS host:

  ```powershell
  slmgr /skms your-kms-host:1688
  slmgr /ato
  ```

Confirm activation with `slmgr /xpr` or in Settings → Activation.

## Deploy a Windows 11 Pro instance

1. Go to **Compute → Create Instance** (see
   [Create Instance](/public-cloud/compute/create-instance/)).
2. Choose the **Windows 11 Pro** image.
3. Pick a region and a plan. Windows 11 needs at least **4 GB RAM and 2 vCPUs**. **8 GB RAM** is
   recommended for a responsive desktop.
4. Attach to a network and create the instance.

The instance boots straight through to the Windows desktop. There are no setup wizards or
region/keyboard prompts.

:::note

Windows plans are larger than Linux plans because the desktop OS needs more memory and disk. Size
the plan for your workload, not the minimum.

:::

## First login

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

- **Activate Windows** with your license (see [Licensing](#licensing-bring-your-own-license-byol)).
- Change the `Administrator` password to one only you know.
- Set the time zone and run **Windows Update**.
- If you store sensitive data, enable **BitLocker** (the TPM 2.0 backs it automatically).

## Microsoft documentation

For Windows 11 features, administration, and licensing details, see the official Microsoft
documentation:

- [Windows 11 documentation](https://learn.microsoft.com/en-us/windows/)
- [Activate Windows](https://support.microsoft.com/en-us/windows/activate-windows-c39005d4-95ee-b91e-b399-2820fda32227)

## Good to know

- **Snapshots and backups** work with the guest agent installed. See
  [VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots/) and
  [Backups](/public-cloud/backups-snapshots/backups/).
- The image is rebuilt and re-validated for each release. Existing instances are unaffected.
- Only Windows 11 **Pro** is offered as a hosted client image today. For the server OS, see
  [Windows Server](/public-cloud/operating-systems/windows-server/).
- For the full image catalog, see [Operating System Images](/public-cloud/operating-systems/).

---
title: 'Connect Your Ubuntu Desktops to Private Storage'
description:
  Mount the private file share from Deploy Private Shared Storage on your Ubuntu employee desktop,
  so company files persist independently of any one desktop VM.
sidebar:
  label: 'Connect Desktops to Storage'
---

Mount the file share from [Deploy Private Shared Storage](/tutorials/deploy-private-shared-storage)
on the desktop from [Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops),
so the employee has a persistent, shared place for company files that survives VM rebuilds and isn't
tied to any one desktop.

About 15 minutes per desktop.

:::note

By default this is a trusted, team-wide share, not per-employee isolated storage. If your
organization needs real per-employee isolation, that's decided in
[Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops)'s Step 5, before the
employee's first login. Nothing to configure here for that. See Troubleshooting at the end of this
tutorial if a desktop already had its first login before that step was applied.

:::

## Before you start

- [Deploy Private Shared Storage on ZCP](/tutorials/deploy-private-shared-storage) complete: an NFS
  share up and reachable over the tier
- [Deploy Ubuntu Employee Desktops on ZCP](/tutorials/deploy-ubuntu-employee-desktops) complete: a
  desktop VM, RDP-reachable, with its named employee user
- The storage VM's tier IP and export path, and both VMs' public IPs and your SSH key, all from
  those two tutorials

## Step 1: Install the NFS client on the desktop

Every remaining command in this tutorial runs inside the RDP session on the desktop VM, not on the
storage VM, and not on your own local machine. Connect over RDP as in the previous tutorial, open a
terminal inside the desktop (Konsole, from the KDE application launcher), and run everything below
there.

`nfs-common` is not present by default on the `ubuntukde` template:

```bash
sudo apt-get update && sudo apt-get install -y nfs-common
```

![apt-get install nfs-common output inside the RDP session](../../../assets/connect-desktops-to-storage/01-nfs-common-install.png)

:::note

Unlike the `ubuntu` default user on the network and storage tutorials' infrastructure VMs
(passwordless `sudo`, standard for cloud-init default users), the desktop's named employee user
requires a password for `sudo`. This is expected and correct for a real desktop user, just worth
knowing so it doesn't look like something's broken when a password prompt appears here and didn't in
earlier tutorials.

:::

## Step 2: Mount the share

```bash
sudo mkdir -p /mnt/company-share
sudo mount -t nfs <storage-vm-tier-ip>:/srv/nfs/company-share /mnt/company-share
```

:::caution

Type or paste this as two clearly separate arguments: the NFS source and the local mount point. Some
terminals drop the space between them on paste, merging both into one path
(`.../company-share/mnt/company-share`). `mount` then fails with "can't find in /etc/fstab" instead
of a clear error, and `/mnt/company-share` silently stays as your local root disk. If writes to it
fail with "Permission denied" right after mounting, check `df -h /mnt/company-share` first. If it
shows your local disk instead of the NFS source, the mount never actually happened.

:::

Verify it worked and that you can actually use it:

```bash
df -h /mnt/company-share
echo "hello from desktop" > /mnt/company-share/from-desktop.txt
cat /mnt/company-share/from-desktop.txt
ls -la /mnt/company-share/
```

![Mount confirmed via df -h, then writing and reading a test file successfully](../../../assets/connect-desktops-to-storage/02-mount-and-verify.png)

NFS enforces permissions by raw UID number, not by username. See it for yourself, from a separate
session on the storage VM:

```bash
ssh ubuntu@<storage-vm-public-ip>

ls -la /srv/nfs/company-share/
```

![The storage VM's own view of the file, owned by a bare number since no matching local account exists there](../../../assets/connect-desktops-to-storage/03-storage-side-uid-collision.png)

The file shows correctly by name when viewed from the desktop, but shows as a bare number when
viewed from the storage server or any other machine, since no local user with that UID exists there.
That part is harmless, just cosmetic. It's the underlying UID match or mismatch between desktops
that actually matters, not whether the storage VM can resolve a name.

For a persistent mount across reboots, add it to `/etc/fstab` on the desktop:

```bash
<storage-vm-tier-ip>:/srv/nfs/company-share /mnt/company-share nfs defaults,noatime 0 0
```

:::note

A systemd automount unit is a more resilient alternative, since it avoids a boot hang if the storage
VM is briefly unreachable, but it adds complexity. The plain `fstab` entry above is the recommended
default, matching the storage VM's own approach in the previous tutorial.

:::

## Step 3: Confirm it's visible in the KDE desktop environment

The mounted share appears automatically in Dolphin, the KDE file manager, under **Places → Remote**
rather than Devices. No manual bookmarking is needed.

![Dolphin showing the mounted share under Places, Remote, with both files visible](../../../assets/connect-desktops-to-storage/07-dolphin-share-visible.png)

## Step 4: Repeat for each employee desktop

Once mounted and verified, this becomes a step in the standard onboarding flow. If your organization
needs per-employee isolation, that decision happens in the desktop tutorial's own Step 5, before
each new employee's first login.

## Clean up

```bash
sudo umount /mnt/company-share
```

Remove the `fstab` entry only if tearing down a test desktop. In normal operation this mount is
meant to be permanent.

## Recap

```bash
sudo apt-get install -y nfs-common
sudo mkdir -p /mnt/company-share
sudo mount -t nfs <storage-vm-tier-ip>:/srv/nfs/company-share /mnt/company-share
# add to /etc/fstab for persistence
```

## Troubleshooting: the employee already logged in before applying Tutorial 3's identity fix

If your organization needs per-employee isolation but a desktop's employee has already used it at
least once before [Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops)'s
Step 5 was applied, the fix still works, with two extra hurdles.

**`usermod` refuses while the employee has an active session.** A logged-in desktop session is a lot
of processes (KDE, xrdp, the shell, all of it):

```
usermod: user adjartey is currently used by process 2357
```

**Closing the RDP client window does not end the session.** This is a real gotcha, not a guess:
closing the window and reconnecting later showed every process still running, identical PIDs. The
session and everything in it stays alive on the server; only the display connection drops. From a
separate SSH session as `ubuntu` (not the employee's RDP session, which is what's being ended):

```bash
ssh ubuntu@<desktop-vm-public-ip>

sudo loginctl terminate-user adjartey
```

Only once that returns no running processes for the user does the fix succeed. The employee can log
back in immediately after with the same username and password, home directory and `sudo` access both
intact:

![Logged back in as the reassigned UID, home directory and sudo access both confirmed working](../../../assets/connect-desktops-to-storage/05-uid-fix-login-verified.png)

**Files already written under the old UID don't get fixed by `chown` from the desktop.** The export
uses `root_squash`, which strips root's power over the share specifically to stop a compromised
client from claiming root privileges on shared storage. That's exactly what blocks a client-side
retroactive fix too:

```
$ sudo chown 2001:2001 /mnt/company-share/from-desktop.txt
chown: changing ownership of '/mnt/company-share/from-desktop.txt': Operation not permitted
```

Run the same `chown` from the **storage VM's own local filesystem** instead, where `root_squash`
doesn't apply since it's not a remote client request:

```bash
ssh ubuntu@<storage-vm-public-ip>

sudo chown 2001:2001 /srv/nfs/company-share/from-desktop.txt
```

![Both the pre-existing file and a newly written one now correctly owned by the reassigned UID](../../../assets/connect-desktops-to-storage/06-both-files-correct-owner.png)

Anything written _after_ the fix gets the correct owner automatically. Only files that predate it
need this manual step.

## Next steps

The rest of this series (making it operational for a team) is still in progress. In the meantime:

- [Deploy Private Shared Storage on ZCP](/tutorials/deploy-private-shared-storage): the share this
  tutorial mounts
- [Deploy Ubuntu Employee Desktops on ZCP](/tutorials/deploy-ubuntu-employee-desktops): the desktop
  this tutorial connects
- [Tutorials overview](/tutorials): the full list of available tutorials

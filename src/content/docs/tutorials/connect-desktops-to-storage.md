---
title: 'Connect Your Ubuntu Desktops to Private Storage on ZCP'
description:
  Mount the private file share from Deploy Private Shared Storage on your Ubuntu employee desktop
  over SSH, before handing off RDP credentials, so company files persist independently of any one
  desktop VM.
sidebar:
  label: 'Connect Desktops to Storage (CLI)'
---

Mount the file share from [Deploy Private Shared Storage](/tutorials/deploy-private-shared-storage)
on the desktop from [Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops),
as part of provisioning that desktop, before the employee ever receives their RDP login. The
employee ends up with a persistent, shared place for company files that survives VM rebuilds and
isn't tied to any one desktop, without doing anything themselves.

About 10 minutes per desktop.

:::note

By default this is a trusted, team-wide share: every desktop's employee login gets the same UID
unless you act, so they're the same filesystem identity here, able to overwrite or delete each
other's files. If your organization needs separate ownership per employee, that's decided in
[Give this desktop a unique identity on shared storage](/tutorials/deploy-ubuntu-employee-desktops#give-this-desktop-a-unique-identity-on-shared-storage),
before the employee's first login. Nothing to pass to this script for that. A unique UID stops
employees from overwriting or deleting each other's files, but the share's default permissions (mode
`1777`, files typically created `0644`) still leave files readable by anyone else with access to
it - a unique UID is ownership separation, not read confidentiality. See Troubleshooting at the end
of this tutorial if a desktop already had a login before the identity step was applied.

:::

## Before you start

- [Deploy Private Shared Storage on ZCP](/tutorials/deploy-private-shared-storage) complete: an NFS
  share up and reachable over the tier, and the storage VM's tier IP saved from that script's own
  summary output. There's no reliable way to look up an existing VM's tier IP after the fact, only
  what the script printed once.
- [Deploy Ubuntu Employee Desktops on ZCP](/tutorials/deploy-ubuntu-employee-desktops) complete: a
  desktop VM with its named employee login created via cloud-init.
- SSH access to the desktop still working: the same key from the desktop tutorial, loaded in your
  SSH agent or default location. The script connects as `ubuntu` using that existing access, locked
  down to your own IP in the desktop tutorial, and doesn't take an SSH key or password flag of its
  own.
- The `zcp` CLI installed and authenticated (`zcp auth validate`), from the setup in Build a Private
  Network. `jq` installed too: the script uses the `zcp` CLI to resolve the desktop's public IP from
  `--desktop-name`, the same way earlier scripts in this series resolve resources by name.
- The employee doesn't have their RDP login yet. Run this script while access to the desktop is
  still SSH-only, through you.

:::note

This script needs a bash shell. That's native on macOS and Linux. On Windows, run it from WSL or Git
Bash, same as the earlier tutorials.

:::

## Run the script

Mounting the storage share on a desktop, confirming the employee account, installing the NFS client,
and adding the persistent `/etc/fstab` entry is one script: `zcp/connect-desktop-to-storage.sh` from
the [zsoftly/tools](https://github.com/zsoftly/tools) repository. It connects over SSH and runs
through the phases explained in the next section, in order.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zsoftly/tools/main/zcp/connect-desktop-to-storage.sh) \
  --desktop-name jane-doe-desktop --storage-tier-ip <storage-vm-tier-ip> --username janedoe \
  --region yul-1 --project default-9
```

This tutorial continues `jane-doe-desktop` and `janedoe` from the desktop tutorial's own example,
and `<storage-vm-tier-ip>` from the storage tutorial's script summary. Your own values will differ
based on the `--name` and `--username` you used there and the tier IP printed for your own storage
VM.

The script picks up `ZCP_REGION` and `ZCP_PROJECT` from your shell if you exported them. Pass
`--region`/`--project` instead if you didn't.

| Flag                | Purpose                                                              | Default / requirement      |
| ------------------- | -------------------------------------------------------------------- | -------------------------- |
| `--desktop-name`    | The desktop VM's name, from the desktop tutorial                     | Required                   |
| `--storage-tier-ip` | The storage VM's tier IP, from the storage tutorial's script summary | Required                   |
| `--username`        | The employee's Linux login on the desktop                            | Required                   |
| `--share-name`      | NFS share directory name                                             | `company-share`            |
| `--region`          | zcp region slug                                                      | Required (flag or env var) |
| `--project`         | zcp project slug                                                     | Required (flag or env var) |

`--storage-tier-ip` isn't auto-discovered. Unlike the desktop, which the script resolves by name
through the `zcp` CLI, an existing storage VM's tier IP has no equivalent lookup after deployment.
The storage tutorial's own script summary is the only place it's printed.

`--share-name` must match the storage VM's own `--share-name` from the storage tutorial. It defaults
to `company-share` on both scripts, so most runs leave it out entirely.

:::note

There's no password flag. The NFS client install, the mount, and the `fstab` entry all run through
your existing SSH admin access as `ubuntu`, the same passwordless-sudo access already locked down to
your own IP in the desktop tutorial. The employee's login only matters for the verification step
below, and `ubuntu`'s own sudo privilege reaches it directly with `sudo -u <username>`. The employee
never authenticates, and the script never touches or needs their password.

:::

## What the script does

### Confirms the employee account exists

The script SSHes to the desktop as `ubuntu`, the same admin access already locked down to your own
IP in the desktop tutorial, and confirms the `--username` account exists before doing anything else.

### Installs the NFS client

`nfs-common` isn't present by default on the `ubuntukde` template. This mirrors the mesh-client
check from
[Deploy Private Shared Storage](/tutorials/deploy-private-shared-storage#verify-from-a-mesh-client):
the same install-mount-verify sequence, already proven reachable over the mesh from a generic
client. Over the same SSH connection, this looks like:

```bash
sudo apt-get update && sudo apt-get install -y nfs-common
```

### Mounts the share

```bash
sudo mkdir -p /mnt/company-share
sudo mount -t nfs <storage-vm-tier-ip>:/srv/nfs/company-share /mnt/company-share
```

`sudo mount` always runs as root, regardless of which user's SSH session invoked it, so the mount
itself never decides file ownership. NFS enforces permissions by raw UID number, not by username.
Ownership comes from who writes a file afterward, not who ran the mount. That's why the verification
step below writes specifically as the employee, separately from mounting.

You can see the raw-UID behavior for yourself from your own local machine, not the desktop:

```bash
ssh ubuntu@<storage-vm-public-ip>

ls -la /srv/nfs/company-share/
```

A file written under an employee's UID shows correctly by name when viewed from the desktop, but
shows as a bare number when viewed from the storage server specifically, since it has no local user
at that UID. That part is harmless, cosmetic only. A different desktop is not the same case: if it
has its own local user at that same UID (likely, since every desktop gets the same UID by default
unless you assigned unique ones), the file shows under that user's name there too, even though it's
a different employee. The UID match or mismatch between desktops is what matters, not whether any
one machine can resolve a name for it.

### Verifies the mount works, as the employee

A `mount` command returning success doesn't prove the share is usable, and it doesn't prove the
employee can write to it under their own UID either. The script switches to the employee with
`sudo -u <username>`, writes a uniquely named test file to the mount, reads it back, then deletes
it. `sudo -u` is `ubuntu`'s own privilege to run a command as another local user; the employee
doesn't authenticate for this, and nothing is left on the share afterward for you to inspect.

To see the same idea yourself, run an equivalent check manually over SSH:

```bash
df -h /mnt/company-share
sudo -u janedoe sh -c 'echo "hello from desktop" > /mnt/company-share/from-desktop.txt'
cat /mnt/company-share/from-desktop.txt
ls -la /mnt/company-share/
```

This is optional. It repeats the same check the script already ran; run it again only if you want to
see it for yourself.

### Adds the persistent fstab entry

For a mount that survives reboots, the script appends an entry to `/etc/fstab` on the desktop:

```
<storage-vm-tier-ip>:/srv/nfs/company-share /mnt/company-share nfs defaults,noatime,nofail,_netdev 0 0
```

`nofail` keeps a boot from hanging if the storage VM is briefly unreachable when the desktop starts.
`_netdev` tells systemd to wait for the network before attempting the mount at all. Both matter here
in a way they wouldn't for a local disk. This platform has no console access, so a desktop that
stalls at boot over an NFS mount has no recovery path, unlike a local-disk boot failure.

Re-running the script against the same desktop is safe. It skips the mount and `fstab` steps if
they're already in place rather than duplicating them or failing. If you're pointing it at a
different storage VM, a changed tier IP, unmount first: `sudo umount /mnt/company-share` over SSH.
The script errors on a mismatched source instead of silently switching it for you.

:::note

A systemd automount unit is a more resilient alternative still, since it mounts on first access
instead of at boot, but it adds complexity the script doesn't set up. The plain `fstab` entry above
is the recommended default.

:::

## Confirm it in Dolphin before handoff

One thing the script can't check for you: Dolphin, the KDE file manager, surfaces the mounted share
automatically under **Places → Remote** rather than Devices, but confirming that needs an actual RDP
session. Log in once yourself, using the password from the desktop tutorial's own script summary,
and check **Places → Remote** before handing the login over to the employee.

## Repeat for each desktop

Run the script again for the next desktop, with that desktop's own `--desktop-name` and
`--username`. This becomes a step in the standard onboarding flow, before handing off RDP
credentials each time. If your organization needs separate ownership per employee, that decision
still happens in
[Give this desktop a unique identity on shared storage](/tutorials/deploy-ubuntu-employee-desktops#give-this-desktop-a-unique-identity-on-shared-storage),
before the employee's first login.

## Clean up

```bash
sudo umount /mnt/company-share
```

Run this the same way as everything else in this tutorial: over SSH, not inside an RDP session.
Remove the `fstab` entry only if you're tearing down a test desktop:

```bash
sudo sed -i '\#/mnt/company-share#d' /etc/fstab
```

In normal operation this mount is meant to be permanent.

## Recap

```bash
connect-desktop-to-storage.sh --desktop-name <name> --storage-tier-ip <ip> \
  --username <login> --region yul-1 --project default-9
```

1. Run the script against a desktop before handing off its RDP credentials, with the storage VM's
   tier IP from the storage tutorial's script summary.
2. The script confirms the employee account, installs `nfs-common`, mounts the share through your
   existing `ubuntu` SSH access, then verifies it by writing and reading a test file as the employee
   (`sudo -u <username>`), confirming ownership under their own UID, and adds a persistent `fstab`
   entry. Safe to re-run against the same desktop.
3. Log in once yourself with the employee's password, from the desktop tutorial's own summary, to
   confirm the share appears in Dolphin under Places → Remote, then hand the credentials to the
   employee.
4. Run the script again for each additional desktop.

## Troubleshooting: adding storage to a desktop the employee already used

This section applies if you or the employee have logged in via RDP before applying the identity fix
in
[Give this desktop a unique identity on shared storage](/tutorials/deploy-ubuntu-employee-desktops#give-this-desktop-a-unique-identity-on-shared-storage).
That includes the Dolphin check above: logging in yourself to confirm the share starts a real KDE
session under the employee's own account, the same as the employee's first login would. If no one
has logged in yet, `usermod` and `groupmod` apply cleanly, with no extra steps.

If a login already happened, the fix still works, with two extra hurdles.

**`usermod` refuses while the employee has an active session.** A logged-in desktop session is a lot
of processes (KDE, xrdp, the shell, all of it):

```
usermod: user janedoe is currently used by process 2357
```

**Closing the RDP client window does not end the session.** This is a real gotcha, not a guess:
closing the window and reconnecting later showed every process still running, identical PIDs. The
session and everything in it stays alive on the server. Only the display connection drops. From your
own local machine, SSH in as `ubuntu` (not the employee's RDP session, which is what's being ended):

```bash
ssh ubuntu@<desktop-vm-public-ip>

sudo loginctl terminate-user janedoe
pgrep -u janedoe || echo "no processes left"
```

Only once that shows no processes left does the fix succeed. Re-run the `usermod`/`groupmod`/`chown`
commands from
[Give this desktop a unique identity on shared storage](/tutorials/deploy-ubuntu-employee-desktops#give-this-desktop-a-unique-identity-on-shared-storage),
then the employee can log back in immediately with the same username and password, home directory
and `sudo` access both intact.

**`chown` from the desktop doesn't fix files already written under the old UID.** The export uses
`root_squash`, which strips root's power over the share specifically to stop a compromised client
from claiming root privileges on shared storage. That's exactly what blocks a client-side
retroactive fix too, for any file that predates the identity change, for example a file named
`notes.txt` already on the share (not something the script itself leaves behind; its own
verification file deletes itself):

```
$ sudo chown 2001:2001 /mnt/company-share/notes.txt
chown: changing ownership of '/mnt/company-share/notes.txt': Operation not permitted
```

Run the same `chown` from the **storage VM's own local filesystem** instead, where `root_squash`
doesn't apply since it's not a remote client request. From your own local machine:

```bash
ssh ubuntu@<storage-vm-public-ip>

sudo chown 2001:2001 /srv/nfs/company-share/notes.txt
```

Anything written after the fix gets the correct owner automatically. Only files that predate it need
this manual step.

## Next steps

- [Deploy Private Shared Storage](/tutorials/deploy-private-shared-storage): the share this tutorial
  mounts
- [Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops): the desktop this
  tutorial connects, before RDP credentials are handed off
- [CLI reference](/public-cloud/cli/reference): every command and flag
- [Tutorials overview](/tutorials): the full list of available tutorials

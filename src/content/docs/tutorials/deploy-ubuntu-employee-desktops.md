---
title: 'Deploy Ubuntu Employee Desktops on ZCP'
description:
  Deploy a full Ubuntu KDE remote desktop for one employee into your private tier from Build a
  Private Network with Headscale, reached only through the mesh over RDP, using the zcp CLI.
sidebar:
  label: 'Deploy Employee Desktops (CLI)'
---

This tutorial deploys a full Ubuntu KDE desktop for one employee on a VM inside the private tier
from [Build a Private Network with Headscale](/tutorials/build-private-network-headscale). The
desktop is reached only through the mesh over RDP, and RDP is never exposed publicly. Once
connected, it behaves like any other remote desktop.

By the end you have:

- A VM inside your existing private tier, running a full Ubuntu KDE desktop
- A named login for the employee, provisioned via cloud-init, not the template's own default account
- Confirmation that the desktop works end to end over RDP, and that its public IP has nothing but
  SSH reachable on it

Plan for about 30 minutes: image deploy, first-boot KDE provisioning, and bringing up the tier
network interface.

## Before you start

- [Build a Private Network with Headscale](/tutorials/build-private-network-headscale) complete: a
  VPC with a private tier, a Headscale server, and a subnet router already advertising and serving
  that tier's route, e.g. `my-workspace-tier` if you used `--name my-workspace`. This tutorial
  doesn't depend on the storage tutorial.
- `ZCP_REGION` and `ZCP_PROJECT` still exported from an earlier tutorial, or re-export them.
- The same SSH key name from that tutorial's Step 4.
- `jq`, `ssh`, and `curl` installed. The deploy script requires all three (`curl` for its
  `ifconfig.me` public-IP detection). The teardown script further down only needs `jq`, same as the
  earlier tutorials.
- An RDP client: the built-in Remote Desktop Connection on Windows, Microsoft Remote Desktop from
  the macOS App Store, or Remmina or FreeRDP on Linux, running on a device already connected to the
  mesh from the previous tutorial. The desktop's tier IP is reachable only from inside the tier or
  over the mesh.

:::note

This script and the teardown script further down need a bash shell. That's native on macOS and
Linux. On Windows, run it from WSL or Git Bash, same as the earlier tutorials.

:::

## Run the script

Deploying the desktop VM, its cloud-init login, and the tier network interface is one script:
`zcp/deploy-employee-desktop.sh` from the [zsoftly/tools](https://github.com/zsoftly/tools)
repository. It runs through the same phases explained in the next section, in order.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zsoftly/tools/main/zcp/deploy-employee-desktop.sh) \
  --name jane-doe-desktop --tier-name my-workspace-tier --username janedoe --ssh-key my-key
```

This tutorial uses `jane-doe-desktop` as `--name`, `janedoe` as `--username`, and
`my-workspace-tier` as the tier from the previous tutorial's `my-workspace` example. Your own values
will differ.

Leave `--password` out and the script generates a strong random password locally and prints it once
in the final summary. Save it then. It isn't shown again on a rerun. Pass `--password` explicitly
only if you need a specific value.

The script picks up `ZCP_REGION` and `ZCP_PROJECT` from your shell if you exported them. Pass
`--region`/`--project` instead if you didn't.

| Flag                 | Purpose                                        | Default / requirement                                         |
| -------------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `--name`             | Exact name for the desktop VM                  | Required                                                      |
| `--tier-name`        | The existing private tier to attach to         | Required                                                      |
| `--username`         | The desktop login, provisioned via cloud-init  | Required                                                      |
| `--ssh-key`          | Key name, used for the desktop VM              | Required                                                      |
| `--password`         | The desktop login's password                   | Auto-generated locally and printed once if omitted            |
| `--region`           | zcp region slug                                | Required (flag or env var)                                    |
| `--project`          | zcp project slug                               | Required (flag or env var)                                    |
| `--my-ip`            | Your public IP in CIDR form, scopes SSH access | Auto-detected via `ifconfig.me`                               |
| `--vm-template`      | ubuntukde marketplace template slug            | Auto-discovered, must be version 1.0.2 or later               |
| `--vm-plan`          | Compute plan for the desktop VM                | Auto-selects the smallest plan meeting a 4 vCPU/16GB baseline |
| `--network-plan`     | Network plan for the VM's public IP            | Auto-discovered                                               |
| `--storage-category` | Storage category for the VM's root disk        | Auto-discovered                                               |
| `--billing-cycle`    | `hourly` or `monthly`                          | `hourly`                                                      |
| `-y`/`--yes`         | Skip the confirmation prompt                   | Off                                                           |

`--tier-name` is not auto-discovered, the same as the earlier tutorials' scripts. An account can
hold more than one private tier from earlier testing, and guessing which one to attach to is a real
isolation risk. The script hard-errors if the name you pass doesn't resolve to exactly one tier.

`--username` must match `^[a-z][a-z0-9_]*$` (lowercase letters, digits, and underscores only,
starting with a letter), max 32 characters, and is checked before anything gets created. The script
also rejects a fixed list of reserved system account names outright, `ubuntu` among them: it's this
script's own SSH admin user, a guaranteed collision if picked as the desktop login too. Run the
script with `--help` for the full list of overrides.

## What the script builds

### Template selection and version check

**The script finds the ubuntukde template for you, and refuses to deploy anything older than the
version this tutorial was validated against.**

Without `--vm-template`, the script auto-discovers the ubuntukde template.
`zcp template list | grep -i ubuntukde` shows the idea, but the script itself runs
`zcp template list -o json | jq '.[] | select(.name | test("ubuntukde";"i")) | .slug' | head -1` to
pick the first match programmatically. It then parses the app version out of the template's name
(the `.version` field in the API is the OS version, e.g. `24.04 LTS`, not the app version) and
requires at least `1.0.2`.

:::note

Version `1.0.2` fixes a real bug: snap-confined apps such as Firefox and Chromium silently failing
to launch over RDP because of a missing environment variable. An older template is refused outright,
with an explanation, rather than silently deployed. `--vm-template` only lets you pin a specific
1.0.2-or-later template, for example if more than one qualifies. It doesn't bypass the version
check: an explicitly passed template still has to meet the same 1.0.2 floor, and the script still
refuses it otherwise.

:::

### The desktop VM

**The script deliberately allocates a public IP to the VM, for the one-time setup below only, then
locks it down to nothing but SSH. RDP is never opened on the public side at all.**

A VM with no public network footprint sounds like the most private option. But there's no
console/recovery access on this platform, so a VM that can't be reached at all can't be recovered if
the one-time tier-interface setup below goes wrong. The script deploys normally instead. It
allocates a public IP, then locks SSH down to your own IP. RDP is never opened on the public side at
any point, so the desktop ends up just as unreachable over RDP publicly as a no-public-IP VM would
be. The public IP exists only for tightly scoped admin access.

The VM is attached to the tier you named with `add-network`, the same step the earlier tutorials'
scripts use.

:::note

4 vCPU / 16GB is a comfortable baseline for a smooth desktop experience. 4 vCPU/8GB is usable but
noticeably less responsive. If you leave `--vm-plan` out, the script selects the smallest plan
meeting that 4 vCPU/16GB baseline automatically, and errors if none exists in your account or
region. Pass `--vm-plan` explicitly to pin a specific one instead.

:::

### The cloud-init desktop user

**Each employee gets a named login provisioned via cloud-init, not the template's own generated
default user, with the username and password validated before anything is created.**

The script writes a small cloud-config to a local temp file (kept out of the VM-create command's
process arguments, restricted to owner-only, and removed when the script exits) and passes it with
`--user-data-file`:

```yaml
#cloud-config
write_files:
  - path: /etc/zmi/deploy.env
    content: |
      UBUNTUKDE_USERNAME=janedoe
      UBUNTUKDE_PASSWORD=<generated-or-provided-password>
```

:::caution

The template's own first-boot script rejects some usernames outright. Testing confirmed this live: a
dotted username failed with `invalid desktop username` and never created the user at all. The script
checks `--username` against `^[a-z][a-z0-9_]*$` before creating anything, rather than letting a bad
value waste a full VM deploy. It also rejects a fixed list of reserved and default system account
names, including `ubuntu`, `nobody`, and `root`. `ubuntu` in particular is both this script's own
SSH admin user and the cloud image's own pre-existing default account: picking it as the desktop
login would be a guaranteed collision, silently reporting success with a password that was never set
on that account.

:::

:::caution

Without `--password`, the script generates a strong random alphanumeric password locally and prints
it once in the final summary. Save it then. Passing `--password` explicitly opts out of that
generation, and the value may then be visible in your shell history or process list. An explicit
password must be at least 8 characters, using only letters, digits, and `!#%&()*+,./:;<=>?@^_~-`,
since it's written into the cloud-init file above verbatim.

:::

### SSH lockdown

**The template's own default SSH firewall rule, open to any address, is found and removed
automatically. Only your own IP keeps access.**

Marketplace App templates like this one get a default SSH firewall rule at deploy time, open to any
address (`0.0.0.0/0`, both TCP and UDP port 22), not something you created and not scoped to you.
The script creates a rule scoped to your own IP first, confirms it exists, then removes the open
rule and confirms nothing on `0.0.0.0/0` remains on port 22, the same lockdown
`build-private-network.sh` applies to its own VMs.

On a rerun, the script also removes any port-22 rule scoped to a different IP than the current
run's, with a printed `[WARN]`. If your public IP changed since the last run, that old IP's SSH
access is silently revoked in favor of the new one.

### Tier network interface

**The tier interface comes up the same way it does for the subnet router and storage VM in the
earlier tutorials.**

The platform hot-adds the tier's network interface, but the operating system doesn't bring it up
automatically. The script writes a netplan file for it and applies it, then confirms the address
that came up falls inside the tier's CIDR before declaring success.

:::note

Netplan may warn that the file it writes has permissions that are "too open." Expected and harmless
here. The config still applies.

:::

### Confirming the desktop is ready

**The script polls for the cloud-init login to exist, rather than assuming first-boot provisioning
finished the moment SSH answered.**

The script first polls for SSH itself to come up, for up to 3 minutes, before trying anything else.
First-boot KDE provisioning (installing and configuring the desktop, xrdp, and creating the
employee's login) can legitimately still be running for several minutes after SSH becomes reachable.
The script then waits for the username to exist with a human UID (1000 or higher), for up to 5
minutes, rather than erroring on a deploy that's simply still finishing.

If either wait times out, the script errors rather than hanging indefinitely. Check
`sudo journalctl -u cloud-final` directly on the VM, the same check the script's own error message
points at.

## Inspect what was created

```bash
zcp instance list
zcp ip list
```

## Give this desktop a unique identity on shared storage

Only relevant if you plan to also mount private shared storage on this desktop, and it's a manual,
SSH-based step you do yourself, not something the deploy script automates. It's cross-referenced
from the script's own final summary. Do it now, before the employee's first login: it's the only
point where it's cheap and safe to act on.

NFS, if you use it, does raw UID-number mapping, not username mapping. `useradd`, used by the
template's first-boot script, assigns sequential UIDs starting at 1000. Each desktop VM only ever
creates one custom employee user, so every employee's desktop user will almost certainly get the
same UID by default, regardless of username. On shared storage, that means every employee's desktop
user is, by default, the same identity as far as the filesystem is concerned.

:::note

**Default: accept it.** If you're not using shared storage, or a trusted team-wide share is fine for
your organization, no action needed.

:::

To give this employee a unique identity instead, `usermod` and `groupmod` let you reassign the UID
and GID, as long as it happens before the employee's first login. The desktop's public IP is printed
in the script's final summary (or `zcp ip list`):

```bash
ssh ubuntu@<desktop-public-ip>

sudo usermod -u 2001 janedoe
sudo groupmod -g 2001 janedoe
sudo find /home/janedoe -exec chown -h 2001:2001 {} +
id janedoe
```

Pick a unique value per employee across your whole fleet.

:::caution

Track which UID belongs to which employee somewhere durable once you start doing this across a
fleet. There's no template-level bookkeeping for it. If the employee has already logged in at least
once before you get to this step, `usermod` refuses while their session is active, and closing the
RDP client does not end it. Reboot the VM or end the session on the VM directly before retrying.

:::

## Connect over RDP

Run the RDP client from a device already connected to the mesh from the previous tutorial. The
desktop's tier IP is reachable only from inside the tier or over the mesh, so a client on any other
network can't reach it at all.

Connect to the desktop's tier IP, printed in the script's final summary, never the public IP. RDP
was never opened on the public side at all, only SSH, and that's locked to your own IP.

- Address: the tier IP from the script's summary (for example `10.20.1.57`)
- Username and password: the `--username` and password from the script's summary

:::note

On first login, KDE may show a PolicyKit prompt: "System policy prevents control of network
connections." Entering the employee's own password lets the session continue normally.

:::

:::note

If everything looks tiny despite the RDP window filling the screen, set an explicit resolution in
your RDP client rather than relying on auto-negotiation.

:::

:::note

The template deliberately disables the KWin compositor and lowers the RDP color depth by default.
The compositor fights RDP's non-GPU rendering path, and a lower color depth cuts bandwidth, so both
trade some visual polish for performance. No action needed, this is intentional tuning, not a
rendering problem.

:::

## Verify the desktop works end to end

Launch Firefox or Chromium from the KDE application launcher. On any image older than `1.0.2`, this
step fails: the app flashes and closes immediately with no window (the bug the script's version
check above exists to catch before it ever gets this far). Open a terminal too. It confirms the
desktop is a usable work environment, not a browser demo. Confirm internet access works from inside
the session.

:::note

This template's xrdp has no H.264/AVC444 support, only RFX and raw-bitmap encoding, which performs
poorly for continuously changing video content. Run video calls locally on the employee's own
machine instead, and screen-share the RDP client window, rather than joining a call from inside the
session.

:::

## Verify isolation

```bash
# from the public internet:
nc -zv -w 3 <desktop-public-ip> 3389
```

This fails (connection refused or timeout). The desktop's public IP (from the script's summary, or
`zcp ip list`) has SSH open and nothing else. RDP is reachable only from inside the tier or over the
mesh, never from the public internet, since it's never opened on the public side at all.

:::note

On Debian/Ubuntu, install `nc` first if you don't have it
(`sudo apt-get install -y netcat-openbsd`). macOS ships its own `nc` already. Either way it works
the same way in any shell. `/dev/tcp/<host>/<port>` is a bash-only feature and errors outright in
shells like zsh.

:::

Optionally, confirm the same thing from the firewall's own side:

```bash
zcp firewall list --ip <ip-slug>
```

`<ip-slug>` is printed by `zcp ip list`. The only rule you should see on the desktop's public IP is
the scoped SSH rule from the lockdown above, not an open one. There's no RDP port-forward rule to
compare it against: RDP was never opened on the public side, so there's nothing there that needs
changing.

## Clean up

Hourly billing runs while this VM exists. Unlike the storage tutorial, there's no companion volume
to clean up here: this desktop VM has none.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zsoftly/tools/main/zcp/destroy-employee-desktop.sh) \
  --name jane-doe-desktop
```

It picks up `ZCP_REGION`/`ZCP_PROJECT` from your shell the same way the deploy script does. Pass
`--region`/`--project` explicitly if you didn't export them. The script hard-errors without one or
the other, and has no confirmation prompt of its own, matching the teardown scripts in the earlier
tutorials.

:::caution

Like every VM in this series deployed with its own public IP, this desktop also created its own
standalone network and pinned source-NAT IP. `instance delete` won't remove either one. The script
detects and reports a leftover the same way the earlier tutorials' teardown scripts do. Check its
output. If one appears, remove it from the CMP web portal (search by the network ID it prints). A
confirmed leftover makes the script exit non-zero, so check `$?` after running it. A delete the
script issued but never confirmed (a `[WARN]` line, not necessarily a leftover network) also exits
non-zero for the same reason. Don't assume a non-zero exit always means a leftover network. Check
the `[WARN]` lines above it too.

:::

## Recap

1. Deploy a desktop VM inside the tier from the previous tutorial, with a named cloud-init login:
   `deploy-employee-desktop.sh --name jane-doe-desktop --tier-name <tier-name> --username janedoe --ssh-key <name>`.
2. The script picks the ubuntukde template (enforcing version 1.0.2 or later), locks the VM's SSH
   down to your own IP, and brings up the tier interface.
3. Optionally reassign the desktop login's UID over SSH before the employee's first login, if this
   desktop will also mount shared storage.
4. Connect over RDP, from a device already on the mesh, to the tier IP from the script's summary,
   never the public IP. Confirm Firefox or Chromium and a terminal both work, then confirm the
   desktop's public IP has nothing but SSH reachable on it.
5. Run `destroy-employee-desktop.sh --name <name>` when you're done, then check for a leftover
   network the same way the earlier tutorials' teardown does.

## Next steps

The next part of this series (connecting these desktops to private shared storage, and making the
setup operational for a team) is still in progress. In the meantime:

- [Build a Private Network with Headscale](/tutorials/build-private-network-headscale): the tier and
  mesh this tutorial builds on
- [Deploy Private Shared Storage](/tutorials/deploy-private-shared-storage): an NFS share inside the
  same tier, for teams that want a shared area alongside individual desktops
- [CLI reference](/public-cloud/cli/reference): every command and flag
- [Tutorials overview](/tutorials): the full list of available tutorials

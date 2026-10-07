---
title: Format and Mount a Volume
sidebar_position: 2
---

From a Bash shell on the target VM, format and mount a new empty block storage volume.

:::danger

Formatting erases data. Use this procedure only for a new empty volume. Do not continue unless a
stable guest identifier has been explicitly matched to the exact volume selected in the portal.

:::

## Confirm a Stable Volume Identifier

Use a stable guest identifier for the exact volume selected in the portal. Prefer a serial number or
WWN displayed for that portal volume and represented under `/dev/disk/by-id` in the target VM. Use
an identifier only after you have explicitly matched both values. Do not assume that the portal
currently exposes a serial number or WWN. If it does not, or Support cannot confirm the matching
identifier, stop and do not format the volume.

Do not attach or detach disks during this workflow. Replace the placeholder below with the confirmed
`/dev/disk/by-id` path, then run the block in a Bash shell on the target VM.

```bash
VOLUME_ID=/dev/disk/by-id/REPLACE_WITH_CONFIRMED_VOLUME_ID

validate_volume() {
  local candidate candidate_type device_rows filesystem_state root_source root_devices signatures
  candidate="$1"

  if ! candidate_type="$(lsblk -dnpo TYPE "$candidate")" || [ "$candidate_type" != "disk" ]; then
    printf '%s is not a whole disk. Stop.\n' "$candidate" >&2
    return 1
  fi

  if ! device_rows="$(lsblk -npo NAME "$candidate")" ||
    [ "$(printf '%s\n' "$device_rows" | sed '/^$/d' | wc -l | tr -d ' ')" -ne 1 ]; then
    printf '%s has partitions or child devices. Stop.\n' "$candidate" >&2
    return 1
  fi

  if ! filesystem_state="$(lsblk -dnpo FSTYPE,MOUNTPOINTS "$candidate")" ||
    [ -n "$(printf '%s' "$filesystem_state" | tr -d '[:space:]')" ]; then
    printf '%s is formatted or mounted. Stop.\n' "$candidate" >&2
    return 1
  fi

  if ! signatures="$(sudo wipefs --no-act --noheadings --output TYPE "$candidate")"; then
    printf 'Could not inspect %s for signatures. Stop.\n' "$candidate" >&2
    return 1
  fi

  if [ -n "$signatures" ]; then
    printf '%s contains an existing signature. Stop.\n' "$candidate" >&2
    return 1
  fi

  if ! root_source="$(findmnt -n -o SOURCE /)" ||
    ! root_devices="$(lsblk -srnpo NAME "$root_source")" || [ -z "$root_devices" ] ||
    printf '%s\n' "$root_devices" | grep -Fxq "$candidate"; then
    printf '%s may be related to the root filesystem. Stop.\n' "$candidate" >&2
    return 1
  fi
}

case "$VOLUME_ID" in
  /dev/disk/by-id/REPLACE_WITH_CONFIRMED_VOLUME_ID)
    printf 'Replace the placeholder with the confirmed volume identifier. Stop.\n' >&2
    exit 1
    ;;
  /dev/disk/by-id/*) ;;
  *)
    printf 'VOLUME_ID must be a confirmed /dev/disk/by-id path. Stop.\n' >&2
    exit 1
    ;;
esac

if [ ! -L "$VOLUME_ID" ]; then
  printf '%s is not a device symlink. Stop.\n' "$VOLUME_ID" >&2
  exit 1
fi

if ! RESOLVED_DISK="$(readlink -f -- "$VOLUME_ID")" || [ ! -b "$RESOLVED_DISK" ] ||
  ! validate_volume "$RESOLVED_DISK"; then
  exit 1
fi

printf 'Confirmed empty volume: %s -> %s\n' "$VOLUME_ID" "$RESOLVED_DISK"
```

If this command stops, do not select a different device name manually. Open
[Support](/troubleshooting#raise-a-support-ticket) with the project, location, command output, and
non-sensitive resource details.

## Format and Mount the Volume

Run this block and the following persistent-mount block in the same Bash session as the previous
block. Type the exact stable identifier shown by the prompt to confirm formatting. This example uses
`/mnt/zcp-volume` as the mount point. Change it only if you have a documented mount-path standard.

```bash
MOUNT_POINT=/mnt/zcp-volume

if findmnt --mountpoint "$MOUNT_POINT" >/dev/null 2>&1; then
  printf '%s is already mounted. Stop.\n' "$MOUNT_POINT" >&2
  exit 1
fi

if [ -e "$MOUNT_POINT" ] && [ ! -d "$MOUNT_POINT" ]; then
  printf '%s exists and is not a directory. Stop.\n' "$MOUNT_POINT" >&2
  exit 1
fi

if [ -d "$MOUNT_POINT" ]; then
  if ! MOUNT_CONTENT="$(sudo find "$MOUNT_POINT" -mindepth 1 -maxdepth 1 -print -quit)"; then
    printf 'Could not inspect %s. Stop.\n' "$MOUNT_POINT" >&2
    exit 1
  fi

  if [ -n "$MOUNT_CONTENT" ]; then
    printf '%s is not empty. Stop.\n' "$MOUNT_POINT" >&2
    exit 1
  fi
else
  if ! sudo install -d -m 0755 "$MOUNT_POINT"; then
    printf 'Could not create the mount point. Stop.\n' >&2
    exit 1
  fi
fi

read -r -p "Type $VOLUME_ID to confirm formatting: " CONFIRM_VOLUME_ID
if [ "$CONFIRM_VOLUME_ID" != "$VOLUME_ID" ]; then
  printf 'Device confirmation did not match. Stop.\n' >&2
  exit 1
fi

if ! CURRENT_DISK="$(readlink -f -- "$VOLUME_ID")" ||
  [ "$CURRENT_DISK" != "$RESOLVED_DISK" ] || ! validate_volume "$CURRENT_DISK"; then
  printf 'The stable identifier no longer resolves to the confirmed empty disk. Stop.\n' >&2
  exit 1
fi

if ! sudo mkfs.ext4 "$VOLUME_ID"; then
  printf 'Formatting failed. Stop.\n' >&2
  exit 1
fi

UUID="$(sudo blkid -s UUID -o value "$VOLUME_ID")"
if [ -z "$UUID" ]; then
  printf 'No filesystem UUID was found. Stop.\n' >&2
  exit 1
fi

if ! sudo mount --uuid "$UUID" "$MOUNT_POINT"; then
  printf 'Mount failed. Stop.\n' >&2
  exit 1
fi

MOUNT_UUID="$(findmnt --mountpoint "$MOUNT_POINT" -no UUID)"
if [ "$MOUNT_UUID" != "$UUID" ]; then
  printf 'The mounted filesystem UUID does not match the new volume. Stop.\n' >&2
  exit 1
fi
```

## Configure a Persistent Mount

Use the filesystem UUID instead of a device name. The options allow the VM to start if this non-root
cloud volume is unavailable, with a 30-second device wait. The commands validate `/etc/fstab` and
the exact mounted UUID.

```bash
if findmnt --fstab --mountpoint "$MOUNT_POINT" >/dev/null 2>&1; then
  printf '%s already appears in /etc/fstab. Review it before continuing.\n' "$MOUNT_POINT" >&2
  exit 1
fi

FSTAB_BACKUP="$(mktemp)" || exit 1
if ! sudo cp /etc/fstab "$FSTAB_BACKUP"; then
  rm -f "$FSTAB_BACKUP"
  printf 'Could not back up /etc/fstab. Stop.\n' >&2
  exit 1
fi

restore_fstab() {
  if ! sudo cp "$FSTAB_BACKUP" /etc/fstab; then
    printf 'Could not restore /etc/fstab. The backup remains at %s.\n' "$FSTAB_BACKUP" >&2
    return 1
  fi

  if ! rm -f "$FSTAB_BACKUP"; then
    printf '/etc/fstab was restored, but backup cleanup failed: %s.\n' "$FSTAB_BACKUP" >&2
    return 1
  fi
}

if ! printf 'UUID=%s %s ext4 defaults,nofail,x-systemd.device-timeout=30s 0 2\n' "$UUID" "$MOUNT_POINT" |
  sudo tee -a /etc/fstab >/dev/null; then
  if restore_fstab; then
    printf 'Could not update /etc/fstab. The previous file was restored.\n' >&2
  else
    printf 'Could not update /etc/fstab. Restore status is uncertain; the backup remains at %s.\n' "$FSTAB_BACKUP" >&2
  fi
  exit 1
fi

if ! sudo findmnt --verify --tab-file /etc/fstab; then
  if restore_fstab; then
    printf '/etc/fstab validation failed. The previous file was restored.\n' >&2
  else
    printf '/etc/fstab validation failed. Restore status is uncertain; the backup remains at %s.\n' "$FSTAB_BACKUP" >&2
  fi
  exit 1
fi

if ! sudo mount -a; then
  if restore_fstab; then
    printf 'Mounting /etc/fstab entries failed. The previous file was restored.\n' >&2
  else
    printf 'Mounting /etc/fstab entries failed. Restore status is uncertain; the backup remains at %s.\n' "$FSTAB_BACKUP" >&2
  fi
  exit 1
fi

MOUNT_UUID="$(findmnt --mountpoint "$MOUNT_POINT" -no UUID)"
if [ "$MOUNT_UUID" != "$UUID" ]; then
  if restore_fstab; then
    printf 'The mounted filesystem UUID does not match the fstab entry. The previous file was restored.\n' >&2
  else
    printf 'The mounted filesystem UUID does not match the fstab entry. Restore status is uncertain; the backup remains at %s.\n' "$FSTAB_BACKUP" >&2
  fi
  exit 1
fi

rm -f "$FSTAB_BACKUP"
```

The root directory of the new filesystem is owned by `root`. Create an application-specific
subdirectory and assign ownership only according to that application's documented user and group
requirements. Before detaching this volume, unmount it and remove its `UUID=` line from
`/etc/fstab`.

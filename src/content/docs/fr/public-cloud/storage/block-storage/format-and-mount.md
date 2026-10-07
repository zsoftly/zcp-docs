---
title: Formater et monter un volume
sidebar_position: 2
---

Depuis un shell Bash sur l’instance virtuelle cible, formatez et montez un nouveau volume de
stockage bloc vide.

:::danger

Le formatage efface les données. Utilisez cette procédure uniquement pour un nouveau volume vide. Ne
continuez pas sans avoir explicitement associé un identifiant stable dans l’instance virtuelle au
volume exact sélectionné dans le portail.

:::

## Confirmer un identifiant de volume stable

Utilisez un identifiant stable dans l’instance virtuelle pour le volume exact sélectionné dans le
portail. Préférez un numéro de série ou un WWN affiché pour ce volume dans le portail et représenté
sous `/dev/disk/by-id` dans l’instance virtuelle cible. Utilisez un identifiant seulement après
avoir explicitement associé les deux valeurs. Ne présumez pas que le portail expose actuellement un
numéro de série ou un WWN. S’il ne le fait pas, ou si le Support ne peut pas confirmer l’identifiant
correspondant, arrêtez-vous et ne formatez pas le volume.

N’attachez et ne détachez aucun disque pendant ce flux de travail. Remplacez l’espace réservé
ci-dessous par le chemin `/dev/disk/by-id` confirmé, puis exécutez le bloc dans un shell Bash sur
l’instance virtuelle cible.

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

Si cette commande s’arrête, ne sélectionnez pas manuellement un autre nom de périphérique. Ouvrez
[Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien) avec le projet, l’emplacement, la sortie
de la commande et les détails non sensibles de la ressource.

## Formater et monter le volume

Exécutez ce bloc et le bloc de montage persistant suivant dans la même session Bash que le bloc
précédent. Saisissez l’identifiant stable exact indiqué par l’invite pour confirmer le formatage.
Cet exemple utilise `/mnt/zcp-volume` comme point de montage. Modifiez-le seulement si vous disposez
d’une norme documentée pour les points de montage.

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

## Configurer un montage persistant

Utilisez l’UUID du système de fichiers au lieu d’un nom de périphérique. Les options permettent à
l’instance virtuelle de démarrer si ce volume cloud non racine est indisponible, avec un délai
d’attente de 30 secondes pour le périphérique. Les commandes vérifient `/etc/fstab` et l’UUID exact
du volume monté.

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

Le répertoire racine du nouveau système de fichiers appartient à `root`. Créez un sous-répertoire
propre à l’application et attribuez la propriété du sous-répertoire uniquement selon les exigences
documentées de l’utilisateur et du groupe de l’application. Avant de détacher ce volume, démontez-le
et supprimez sa ligne `UUID=` de `/etc/fstab`.

---
title: Deploy Paperclip on ZCP
description:
  Deploy a private Paperclip workspace on ZCP, access it through an SSH tunnel, connect an AI
  provider, and back up and restore its data.
sidebar:
  label: Deploy Paperclip
---

Paperclip is a self-hosted workspace for organizing AI agents and their work. This tutorial shows
how to deploy the prepared Paperclip image on ZCP, keep its dashboard private, connect a provider,
and verify that its data can be restored.

:::note

The Paperclip image is in pre-release review and is not yet listed in the ZCP Marketplace. Follow
this guide only when your ZCP administrator gives you access to the approved image.

:::

## Before You Start

You need:

- Access to the approved Paperclip image in your ZCP project
- A VM plan selected for your expected data retention, model usage, and operating needs
- An SSH key and permission to add a source-restricted SSH firewall rule
- An approved AI provider subscription or API key if you want to run an agent

Acceptance testing used 4 vCPUs, 8 GB RAM, and a 116 GB root filesystem. This is a historical
filesystem measurement, not an allocated-disk value, a minimum, or a capacity recommendation.

Paperclip uses SSH for administration and browser access. Keep SSH restricted to your current public
IP address. Do not expose port 3100 to the internet.

## Deploy the VM

1. In the ZCP Console, create a VM from the approved Paperclip image.
2. Choose your approved plan, network, and SSH key.
3. Create a TCP forwarding rule for port 22 that permits only your current public IP address.
4. Wait until the VM shows as running.

Use the VM's public IP address and the public SSH port from the forwarding rule in the commands
below.

## Verify First Boot

Connect to the VM:

```bash
ssh -i '<private-key-path>' -p '<public-ssh-port>' ubuntu@'<vm-public-ip>'
```

Check the service and its local health endpoint:

```bash
cd /opt/paperclip
sudo docker compose ps
curl -fsS --max-time 10 http://127.0.0.1:3100/api/health
sudo test -f /opt/paperclip/.first-boot-done && echo "First boot completed"
df -h /
```

The `paperclip` container should be running. Its dashboard should listen only on `127.0.0.1:3100`,
and the health response should contain `"status":"ok"`.

If first boot has not completed, inspect its logs before changing any configuration:

```bash
sudo journalctl -u paperclip-first-boot.service -n 160 --no-pager
cd /opt/paperclip && sudo docker compose logs --tail=120
```

## Open the Dashboard Privately

Run this command from your workstation and keep it running:

```bash
ssh -i '<private-key-path>' -p '<public-ssh-port>' -o IdentitiesOnly=yes \
  -o ExitOnForwardFailure=yes -N \
  -L 127.0.0.1:3100:127.0.0.1:3100 ubuntu@'<vm-public-ip>'
```

Open `http://localhost:3100` in a private browser window. The dashboard stays private because the VM
accepts it only on its loopback interface. Paperclip uses `localhost:3100` for browser redirects.

The tunnel closes when the SSH process stops. Recreate it after you restart the VM.

## Create the First Administrator

1. Select **Sign in / Create account**.
2. Create the first Paperclip account and claim the instance.
3. Create your organization. Complete provider and agent setup after the backup and restore checks.
4. Close the browser window. Open a new private window at `http://localhost:3100/auth` and sign in
   with the account you created.

Use a Paperclip password that is distinct from your VM access and provider credentials. Confirm a
deliberately incorrect password is rejected.

From the VM, you can confirm that unauthenticated organization access is denied:

```bash
curl -sS -o /dev/null -w 'Anonymous access: HTTP %{http_code}\n' \
  http://127.0.0.1:3100/api/companies
```

The expected result is `HTTP 403`.

## Verify Restart Recovery

Restart the Paperclip container:

```bash
cd /opt/paperclip
sudo docker compose restart
sleep 20
sudo docker compose ps
curl -fsS --max-time 10 http://127.0.0.1:3100/api/health
```

Restart the VM from the ZCP Console. When it returns to running, reconnect the SSH tunnel, sign in,
and confirm your organization and onboarding data remain available.

## Create a Cold Backup

This procedure briefly stops Paperclip to create a consistent archive. It stores sensitive runtime
configuration and application data in a root-only directory. Keep the archive in an approved backup
location. Run this validation before connecting a provider or running agent tasks. It does not cover
backups of existing deployments that already contain provider credentials or agent state.

```bash
sudo bash -c '
set -euo pipefail
umask 077

compose_file=/opt/paperclip/docker-compose.yml
project_dir=/opt/paperclip
backup_dir="/var/backups/paperclip/$(date -u +%Y-%m-%d-%H%M%S)"
original_stopped=false
mkdir -p "$backup_dir"
chmod 700 "$backup_dir"

restart_original() {
  docker compose -f "$compose_file" --project-directory "$project_dir" start
}

cleanup() {
  status=$?
  if [ "$original_stopped" = true ]; then
    restart_original || status=1
  fi
  exit "$status"
}

signal_exit() {
  exit 1
}

trap cleanup EXIT
trap signal_exit HUP INT TERM

cp "$compose_file" "$backup_dir/docker-compose.yml"
cp /etc/paperclip/runtime.env "$backup_dir/runtime.env"
image="$(docker compose -f "$compose_file" --project-directory "$project_dir" config --images)"

original_stopped=true
docker compose -f "$compose_file" --project-directory "$project_dir" stop
docker run --rm --pull=never --network none \
  --entrypoint tar \
  --mount type=volume,source=paperclip-data,target=/paperclip,readonly \
  --mount "type=bind,source=$backup_dir,target=/backup" \
  "$image" -czf /backup/paperclip-data.tar.gz -C /paperclip .

cd "$backup_dir"
gzip -t paperclip-data.tar.gz
tar -tzf paperclip-data.tar.gz >/dev/null
sha256sum docker-compose.yml runtime.env paperclip-data.tar.gz > SHA256SUMS
sha256sum -c SHA256SUMS
restart_original
original_stopped=false
echo "Backup saved to: $backup_dir"
'
```

Verify the original service after the backup completes:

```bash
sleep 20
curl -fsS --max-time 10 http://127.0.0.1:3100/api/health
```

## Restore into an Isolated Volume

Set `backup_dir` to the backup directory printed by the previous command. This restore procedure
uses a separate Docker volume and VM port 3101. It does not overwrite the running Paperclip data.

:::caution

The restore uses the copied runtime configuration. Do not let the restored copy run agent tasks or
connect to live provider accounts while the original instance is still active.

:::

```bash
(
set -euo pipefail

backup_dir="/var/backups/paperclip/<timestamp>"
sudo bash -c 'cd "$1" && sha256sum -c SHA256SUMS && gzip -t paperclip-data.tar.gz && tar -tzf paperclip-data.tar.gz >/dev/null' _ "$backup_dir"

image="$(sudo docker compose -f "$backup_dir/docker-compose.yml" config --images)"
restore_volume="paperclip-restore-check-$(date -u +%Y%m%d%H%M%S)"
sudo docker volume create "$restore_volume"

sudo docker run --rm --pull=never --network none --entrypoint tar \
  --mount "type=volume,source=$restore_volume,target=/restore" \
  --mount "type=bind,source=$backup_dir/paperclip-data.tar.gz,target=/backup.tar.gz,readonly" \
  "$image" -xzf /backup.tar.gz -C /restore

sudo docker run -d --pull=never --name paperclip-restore-check \
  --env-file "$backup_dir/runtime.env" \
  -e HOST=0.0.0.0 -e PORT=3100 -e PAPERCLIP_HOME=/paperclip \
  -e PAPERCLIP_DEPLOYMENT_MODE=authenticated \
  -e PAPERCLIP_DEPLOYMENT_EXPOSURE=private \
  -e PAPERCLIP_PUBLIC_URL=http://localhost:3100 \
  -p 127.0.0.1:3101:3100 \
  --mount "type=volume,source=$restore_volume,target=/paperclip" \
  "$image"

sleep 20
curl -fsS --max-time 10 http://127.0.0.1:3101/api/health \
  | jq -e '.status == "ok"' >/dev/null
echo "Isolated restore volume: $restore_volume"
)
```

To verify restored data in the browser, press `Ctrl+C` in the workstation terminal running the
original SSH tunnel. Then create a temporary tunnel from workstation port 3100 to VM port 3101:

```bash
ssh -i '<private-key-path>' -p '<public-ssh-port>' -o IdentitiesOnly=yes \
  -o ExitOnForwardFailure=yes -N \
  -L 127.0.0.1:3100:127.0.0.1:3101 ubuntu@'<vm-public-ip>'
```

Open a fresh private browser session at `http://localhost:3100/auth`, manually sign in, and verify
the expected organization and saved onboarding data. Do not let the restored copy run agent tasks.

If a prior restore test left a container named `paperclip-restore-check`, stop it and remove it
before running the restore block again. Removing the container does not remove its Docker volume or
the backup archive.

When finished, stop and remove the test container. The command below does not use `-v`, so it
retains the isolated restore volume. Press `Ctrl+C` in the workstation terminal running the restore
tunnel, then reconnect the workstation tunnel to the original VM port 3100.

```bash
sudo docker stop paperclip-restore-check
sudo docker rm paperclip-restore-check
```

```bash
ssh -i '<private-key-path>' -p '<public-ssh-port>' -o IdentitiesOnly=yes \
  -o ExitOnForwardFailure=yes -N \
  -L 127.0.0.1:3100:127.0.0.1:3100 ubuntu@'<vm-public-ip>'
```

## Connect a Provider and Run a Test Task

In Paperclip, create a connection for your approved provider. Keep API keys, browser authorization
codes, passwords, and session tokens out of shell history, tickets, and source control.

For a subscription connection, Paperclip shows the command to run inside the container. Run the
command generated for your connection. Do not run a provider login command directly on the VM host.

For example, the Claude Code connection uses its own configuration directory:

```bash
cd /opt/paperclip
sudo docker compose exec --user node \
  -e CLAUDE_CONFIG_DIR='/paperclip/instances/default/ai-local-logins/<connection-id>' \
  paperclip sh -lc 'mkdir -p "$CLAUDE_CONFIG_DIR" && claude auth login'
```

Replace `<connection-id>` with the path shown in Paperclip. Complete the browser sign-in flow, then
return to Paperclip and finish agent setup.

Assign the agent this task:

```text
Reply exactly: Paperclip QA successful.
```

Wait for the run to finish. Confirm the agent overview lists the provider adapter you configured,
then inspect its saved response.

## Next Steps

- [Tutorials overview](/tutorials/) for other ZCP deployment guides
- [Marketplace overview](/public-cloud/marketplace/) for published ZCP images
- [Paperclip documentation](https://docs.paperclip.ing/) for product features and provider setup

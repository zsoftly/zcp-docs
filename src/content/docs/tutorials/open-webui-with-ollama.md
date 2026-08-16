---
title: 'Run Open WebUI With Ollama on ZCP'
description:
  Add Open WebUI to an Ollama VM, connect the browser client to the host service, and expose only
  the browser port through ZCP networking.
sidebar:
  label: 'Open WebUI With Ollama'
---

This tutorial adds Open WebUI to a VM that already runs Ollama. Open WebUI and Ollama run on the
same VM. The container provides the browser interface, while Ollama loads and runs the model.

This is the developer and DIY operator guide for adding the browser layer, exposing it safely, and
cleaning up the deployment.

Complete Run Ollama Chat and Inference on ZCP at /tutorials/ollama-chat-and-inference first.

Version française : [Exécuter Open WebUI avec Ollama sur ZCP](/fr/tutorials/open-webui-with-ollama)

:::caution

Ollama has no built-in authentication. Do not expose port 11434 to the public internet when the
browser UI is enough. Expose only the Open WebUI port and restrict its source CIDR.

:::

## 1. Install Docker

Run these commands inside the Ollama VM:

```bash
sudo apt-get update
sudo apt-get install -y docker.io openssl
sudo systemctl enable --now docker
sudo systemctl is-active docker
```

## 2. Start Open WebUI

The host-network mode makes Ollama available at 127.0.0.1:11434 inside the container. Open WebUI
listens on host port 8080.

The example pins Open WebUI to the `v0.11.0` release. The `main` tag is a rolling development target
and is not suitable for a reproducible deployment. Review the release notes before upgrading.

```bash
sudo install -d -m 0750 /etc/open-webui
if [ ! -s /etc/open-webui/secret ]; then
  openssl rand -hex 32 | sudo tee /etc/open-webui/secret >/dev/null
  sudo chmod 600 /etc/open-webui/secret
fi
WEBUI_SECRET_KEY="$(sudo cat /etc/open-webui/secret)"
sudo docker run -d \
  --network=host \
  -v open-webui:/app/backend/data \
  -e OLLAMA_BASE_URL=http://127.0.0.1:11434 \
  -e WEBUI_SECRET_KEY="$WEBUI_SECRET_KEY" \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:v0.11.0
```

Check the container and local UI:

```bash
sudo docker ps --filter name=open-webui
sudo docker inspect --format '{{.State.Health.Status}}' open-webui || true
curl -sS -I http://127.0.0.1:8080/
```

The first browser visit creates the Open WebUI administrator account. The named Docker volume keeps
the account and application data across container restarts.

Open WebUI runs on the same VM as Ollama, so it does not add a second ZCP VM charge. The reference
YUL-1 deployment costs about CA$0.8082/hour, or CA$582/month, for the `ci2.4xl` VM, one isolated
network, and one public IPv4 address before tax. Optional storage, backups, snapshots, and discounts
are separate. See [Run Ollama Chat and Inference on ZCP](/tutorials/ollama-chat-and-inference) for
the cost breakdown and catalog commands.

## 3. Prepare Secure Access

The SSH tunnel in the next step does not need a guest firewall rule for port 8080 or a second ZCP
port forward. Keep Open WebUI private on the VM and use the SSH access restricted in the Ollama
tutorial.

Do not share a plain-HTTP public login URL. For shared public access, terminate TLS at an HTTPS
reverse proxy on port 443, require authentication, and proxy internally to `127.0.0.1:8080`. Publish
only the HTTPS firewall rule and port forward. Do not publish port 3000 over plain HTTP.

## 4. Open WebUI Through an Encrypted SSH Tunnel

Run this command on your workstation. Replace `<public-ip>` with the VM address:

```bash
ssh -i ~/.ssh/id_ed25519 \
  -N \
  -L 3000:127.0.0.1:8080 \
  ubuntu@<public-ip>
```

Keep the SSH session open and open this local address in your browser:

```text
http://127.0.0.1:3000/
```

The browser connection is local, and SSH encrypts the traffic between your workstation and the VM.
After signing in, select llama3.1:8b for interactive chat. Select llama3.3:70b only for slow CPU
quality tests. Open WebUI does not change the model's compute path.

## 5. Keep Ollama Private

Open WebUI does not require public access to port 11434 or port 3000. The SSH tunnel keeps both
services private.

If another application needs the API, run it on the same VM at `http://127.0.0.1:11434` or place an
authenticated reverse proxy on a private network. Do not add a public unauthenticated port forward.

## 6. Cleanup

Remove Open WebUI before deleting the VM:

```bash
sudo docker rm -f open-webui
sudo docker volume rm open-webui
```

List every rule attached to the test IP. Delete one command per returned ID, including the SSH rule
and port forward created by the Ollama tutorial. Omit the HTTPS placeholders if you did not create a
TLS reverse proxy. Add one more delete command for every additional returned ID.

```bash
zcp firewall list --ip <ip-slug> --region yul-1 --project default-9
zcp portforward list --ip <ip-slug> --region yul-1 --project default-9
zcp firewall delete <ssh-firewall-rule-id> --ip <ip-slug> --yes --region yul-1 --project default-9
zcp firewall delete <https-firewall-rule-id> --ip <ip-slug> --yes --region yul-1 --project default-9
zcp portforward delete <ssh-portforward-id> --ip <ip-slug> --yes --region yul-1 --project default-9
zcp portforward delete <https-portforward-id> --ip <ip-slug> --yes --region yul-1 --project default-9
```

Delete the VM:

```bash
zcp instance delete yul-ollama-test \
  --yes \
  --delete-public-ip \
  --region yul-1 \
  --project default-9

zcp instance get yul-ollama-test --region yul-1 --project default-9
```

ZCP may leave a source-NAT IP allocated after the VM detaches. Check the IP list:

```bash
zcp ip list --region yul-1 --project default-9
```

If the IP has no VM but still belongs to the VM's auto-created isolated network, delete that network
only after the VM is gone, then release the IP:

```bash
zcp network delete <auto-created-network> \
  --yes \
  --region yul-1 \
  --project default-9
```

Deleting the auto-created network releases its source-NAT IP. Do not run a separate `zcp ip release`
for that IP. Do not delete a shared network. Remove the deployment SSH key if it was created only
for this test:

```bash
zcp ssh-key delete my-yul-key --yes
```

## References

- Ollama Marketplace reference: /public-cloud/marketplace/ollama
- Open WebUI documentation: https://docs.openwebui.com/
- ZCP firewall settings: /public-cloud/compute/settings/firewall
- ZCP port forwarding: /public-cloud/compute/settings/port-forwarding

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

## 3. Allow the Guest Port

Ubuntu UFW must allow the port used by Open WebUI:

```bash
sudo ufw allow from <trusted-cidr> to any port 8080 proto tcp
sudo ufw status verbose
```

For a short test, use sudo ufw allow 8080/tcp only when the source network is controlled. Remove the
unrestricted rule and apply a trusted CIDR before sharing the URL.

## 4. Forward a Browser Port Through ZCP

Use public port 3000 and private port 8080. Replace <ip-slug> and <trusted-cidr> with values from
your account.

```bash
zcp firewall create \
  --ip <ip-slug> \
  --protocol tcp \
  --cidr <trusted-cidr> \
  --start-port 3000 \
  --end-port 3000 \
  --project default-9 \
  --region yul-1 \
  --auto-approve

zcp portforward create \
  --instance yul-ollama-test \
  --ip <ip-slug> \
  --protocol tcp \
  --public-port 3000 \
  --private-port 8080 \
  --public-end-port 3000 \
  --private-end-port 8080 \
  --project default-9 \
  --region yul-1 \
  --auto-approve
```

Open this address in a browser:

```text
http://<public-ip>:3000/
```

After signing in, select llama3.1:8b for interactive chat. Select llama3.3:70b only for slow CPU
quality tests. Open WebUI does not change the model's compute path.

## 5. Keep Ollama Private

Open WebUI does not require public access to port 11434. Expose only port 3000 to the browser.

If another application needs the API, run it on the same VM at `http://127.0.0.1:11434` or place an
authenticated reverse proxy on a private network. Do not add a public unauthenticated port forward.

## 6. Cleanup

Remove Open WebUI before deleting the VM:

```bash
sudo docker rm -f open-webui
sudo docker volume rm open-webui
```

Delete all firewall rules and port forwards attached to the test IP:

```bash
zcp firewall list --ip <ip-slug> --region yul-1 --project default-9
zcp portforward list --ip <ip-slug> --region yul-1 --project default-9
zcp firewall delete <rule-id> --ip <ip-slug> --yes --region yul-1 --project default-9
zcp portforward delete <forward-id> --ip <ip-slug> --yes --region yul-1 --project default-9
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

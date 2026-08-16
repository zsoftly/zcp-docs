---
title: 'Run Ollama Chat and Inference on ZCP'
description:
  Deploy the Ollama Marketplace image on ZCP and use a local model from the CLI and REST API.
sidebar:
  label: 'Ollama Chat and Inference'
---

This tutorial deploys Ollama on a ZCP virtual machine and shows two direct usage patterns:

- Chat with a model from the Ollama CLI and the /api/chat endpoint.
- Run one-shot inference with the /api/generate endpoint.

This is the developer and DIY operator guide. It includes the commands, network rules, measurements,
and cleanup steps needed to reproduce the deployment.

The reference run used a 16 vCPU, 64 GB Intel VM in YUL-1. It was a bounded validation test and was
deleted after the test.

Version française :
[Exécuter Ollama pour le chat et l'inférence sur ZCP](/fr/tutorials/ollama-chat-and-inference)

:::caution

Ollama has no built-in authentication. Keep port 11434 private when possible. Use an SSH tunnel for
workstation access during initial testing.

:::

## Before You Start

You need:

- A ZCP account, project, and access to YUL-1.
- The zcp CLI installed and authenticated.
- An Ed25519 SSH key pair.
- A workstation with ssh, curl, and date.
- Enough RAM and disk for every model you plan to keep.

The reference catalog values were:

```text
region: yul-1
project: default-9
VM plan display name: ci2.4xl
VM plan CLI slug: ci24xl
network plan: pnet-yul
storage category: pro-nvme
Ollama template: zmi-ollama-0.31.2-ubuntu2404-1.0.0
```

Read the catalog before creating a VM:

```bash
zcp region list
zcp project list
zcp plan vm --region yul-1
zcp plan network --region yul-1
zcp plan storage --region yul-1
zcp template list --region yul-1 | grep -i ollama
```

The ci2.4xl reference plan provided 16 vCPU, 64 GB RAM, and a 320 GB root disk. A 70B Q4 model uses
about 42 GB. The remaining memory is small once the service, context, and operating system are
running.

## Reference cost in YUL-1

The current catalog lists the reference resources in CAD:

| Resource                    |    Hourly |      Monthly |
| --------------------------- | --------: | -----------: |
| `ci2.4xl` VM                |   CA$0.80 |       CA$576 |
| `pnet-yul` isolated network | CA$0.0041 |         CA$3 |
| One YUL IPv4 address        | CA$0.0041 |         CA$3 |
| Reference subtotal          | CA$0.8082 | About CA$582 |

This is a YUL-1 estimate for one VM, one isolated network, and one public IPv4 address. It excludes
taxes, optional block volumes, snapshots, backups, and discounts. The 320 GB root disk is included
in the VM plan. Query the catalog before a paid run because prices and availability change:

```bash
zcp plan vm --region yul-1 --project default-9
zcp plan network --region yul-1 --project default-9
zcp plan ip --region yul-1 --project default-9
```

A 24-hour test at the reference rate is about CA$19.40 before tax. Delete the VM and attached
resources when the test ends.

## 1. Create the VM

Import an SSH key if the project does not already have one:

```bash
zcp ssh-key import \
  --name my-yul-key \
  --key-file ~/.ssh/id_ed25519.pub \
  --project default-9 \
  --region yul-1
```

Create the VM. Replace <ollama-template> with the template slug returned by the catalog command:

```bash
zcp instance create \
  --name yul-ollama-test \
  --hostname yul-ollama-test \
  --project default-9 \
  --region yul-1 \
  --template <ollama-template> \
  --plan ci24xl \
  --billing-cycle hourly \
  --network-plan pnet-yul \
  --storage-category pro-nvme \
  --ssh-key my-yul-key \
  --is-public \
  --wait \
  --auto-approve
```

Record the deployment time and find the public IP:

```bash
date -Is
zcp instance get yul-ollama-test --project default-9 --region yul-1
zcp ip list --project default-9 --region yul-1
date -Is
```

## 2. Open SSH

Replace <ip-slug> and <trusted-cidr> with values from your account. Use your workstation public IP
with a /32 suffix when possible.

```bash
zcp firewall create \
  --ip <ip-slug> \
  --protocol tcp \
  --cidr <trusted-cidr> \
  --start-port 22 \
  --end-port 22 \
  --project default-9 \
  --region yul-1 \
  --auto-approve

zcp portforward create \
  --instance yul-ollama-test \
  --ip <ip-slug> \
  --protocol tcp \
  --public-port 22 \
  --private-port 22 \
  --public-end-port 22 \
  --private-end-port 22 \
  --project default-9 \
  --region yul-1 \
  --auto-approve
```

Connect to the guest and confirm the service:

```bash
ssh -i ~/.ssh/id_ed25519 ubuntu@<public-ip>
hostname
systemctl is-active ollama
systemctl is-active ollama-first-boot.service || true
free -h
df -h /
```

Before pulling a model, bind Ollama to the loopback interface and remove any broad guest firewall
rule for its API. This keeps the unauthenticated API private. Open WebUI on the same VM can still
reach it at `127.0.0.1:11434`.

```bash
sudo install -d -m 0750 /etc/systemd/system/ollama.service.d
printf '[Service]\nEnvironment="OLLAMA_HOST=127.0.0.1:11434"\n' | sudo tee /etc/systemd/system/ollama.service.d/override.conf >/dev/null
sudo systemctl daemon-reload
sudo systemctl restart ollama
sudo ufw delete allow 11434/tcp || true
sudo ss -ltnp | grep 11434
```

## 3. Pull a Model

Start with the 8B model for an interactive CPU test:

```bash
pull_start=$(date +%s)
date -Is
ollama pull llama3.1:8b
pull_end=$(date +%s)
printf 'pull_elapsed_seconds=%s\n' "$((pull_end - pull_start))"
date -Is
ollama list
```

The 8B model is about 4.9 GB. The reference run also pulled llama3.3:70b. The 70B pull took about 31
minutes and occupied 42 GB. If disk space or download time is a concern, pull only the model you
plan to test.

## 4. Chat With Ollama

Use the Ollama CLI for a short interactive chat:

```bash
ollama run llama3.1:8b
```

Type a question at the prompt. Press Ctrl-D to exit.

For an application, use the chat endpoint:

```bash
curl -sS http://127.0.0.1:11434/api/chat \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "llama3.1:8b",
    "stream": false,
    "messages": [
      {"role": "user", "content": "What is a safe way to expose an Ollama API?"}
    ],
    "options": {
      "num_ctx": 2048,
      "num_predict": 128,
      "temperature": 0
    }
  }'
```

Keep the API on 127.0.0.1 while testing. An SSH tunnel lets your workstation use the API without an
inbound Ollama firewall rule:

```bash
ssh -i ~/.ssh/id_ed25519 \
  -L 11434:127.0.0.1:11434 \
  ubuntu@<public-ip>
```

In a second workstation terminal, send requests to `http://127.0.0.1:11434`.

## 5. Run One Inference Request

The generate endpoint is useful for one prompt and one output:

```bash
request_start=$(date +%s)
curl -sS --max-time 900 \
  http://127.0.0.1:11434/api/generate \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "llama3.1:8b",
    "prompt": "Give one short sentence describing this cloud VM.",
    "stream": false,
    "options": {
      "num_ctx": 2048,
      "num_predict": 64,
      "temperature": 0
    }
  }'
request_end=$(date +%s)
printf 'request_elapsed_seconds=%s\n' "$((request_end - request_start))"
```

Use ollama ps after the request to see the loaded model and processor:

```bash
ollama ps
```

## 6. Understand CPU-Only Performance

The reference VM had no NVIDIA GPU. Both models ran on CPU. Smaller models respond sooner because
they require fewer computations. A supported GPU reduces latency, especially for larger models.

| Test                             | Result                                          |
| -------------------------------- | ----------------------------------------------- |
| llama3.3:70b first short request | 117 seconds                                     |
| Two concurrent 70B requests      | 137 and 154 seconds                             |
| Active 70B process               | About 43 GB RSS and up to 99.5% CPU             |
| llama3.1:8b first short request  | 10.96 seconds, including 9.2 seconds of loading |

Use llama3.1:8b for interactive CPU chat. Use llama3.3:70b for quality testing when the longer
response time is acceptable.

## 7. Run Bounded Tests

Install the test tools only during the test window:

```bash
sudo apt-get update
sudo apt-get install -y stress-ng fio
```

The reference run recorded 2,774,619 CPU stress operations, 178 read IOPS, 76 write IOPS, and zero
fio errors during separate 120-second CPU and NVMe tests. The final health check showed 61 GiB
available memory, 265 GB free disk, and no kernel error entries.

## Cleanup

Delete the VM after removing its firewall rules and port forwards:

```bash
zcp firewall list --ip <ip-slug> --region yul-1 --project default-9
zcp portforward list --ip <ip-slug> --region yul-1 --project default-9
zcp firewall delete <rule-id> --ip <ip-slug> --yes --region yul-1 --project default-9
zcp portforward delete <forward-id> --ip <ip-slug> --yes --region yul-1 --project default-9

zcp instance delete yul-ollama-test \
  --yes \
  --delete-public-ip \
  --region yul-1 \
  --project default-9
```

If a source-NAT IP remains after the VM detaches, follow the full cleanup procedure in the Open
WebUI tutorial at /tutorials/open-webui-with-ollama.

## Next Steps

- Add Open WebUI to the VM: /tutorials/open-webui-with-ollama
- Ollama Marketplace reference: /public-cloud/marketplace/ollama
- Ollama API reference: https://docs.ollama.com/api

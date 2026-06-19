---
title: OpenBao
---

OpenBao is an open-source secrets management platform that securely stores and controls access to
tokens, passwords, certificates, and encryption keys. It is the Linux Foundation community fork of
HashiCorp Vault and remains API-compatible with it, so most Vault tooling works unchanged. You run
it as a server, initialise it once, and unseal it to start serving secrets.

:::note[Coming soon]

A pre-built OpenBao image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install OpenBao yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 10 GB   | 20 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **OpenBao**, and click **Deploy**, or create
   an **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean Ubuntu 24.04
   VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install OpenBao

OpenBao publishes an official APT repository. Add its signing key and source, then install the
`openbao` package.

```bash
sudo apt install -y gpg wget
sudo mkdir -p /usr/share/keyrings
wget -qO- https://pkg.openbao.org/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/openbao-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/openbao-keyring.gpg] https://pkg.openbao.org/deb stable main" | sudo tee /etc/apt/sources.list.d/openbao.list
```

Install OpenBao:

```bash
sudo apt update
sudo apt install -y openbao
```

The package installs the `bao` CLI, a dedicated `openbao` user, a systemd service, and a default
configuration file at `/etc/openbao/openbao.hcl`.

## Configure OpenBao

Edit `/etc/openbao/openbao.hcl` to use integrated (Raft) storage and listen on all interfaces. This
quick-start listener disables TLS so you can verify the install. See the TLS note below before
exposing it.

```bash
sudo tee /etc/openbao/openbao.hcl >/dev/null <<'EOF'
ui = true

storage "raft" {
  path    = "/opt/openbao/data"
  node_id = "openbao-1"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = true
}

api_addr     = "http://127.0.0.1:8200"
cluster_addr = "https://127.0.0.1:8201"
EOF

sudo mkdir -p /opt/openbao/data
sudo chown -R openbao:openbao /opt/openbao
```

Enable and start the service, then point the CLI at the local API:

```bash
sudo systemctl enable --now openbao
export BAO_ADDR='http://127.0.0.1:8200'
```

Initialise OpenBao once. This prints the unseal keys and the initial root token. Store them
securely. They cannot be recovered:

```bash
bao operator init
```

OpenBao starts **sealed**. Unseal it by supplying the threshold of unseal keys (three by default),
running the command once per key:

```bash
bao operator unseal
```

Once unsealed, log in with the root token to start managing secrets:

```bash
bao login
```

:::caution

The quick-start listener above runs without TLS. Before exposing OpenBao beyond this host, enable
TLS in the `listener "tcp"` block (set `tls_cert_file` and `tls_key_file`, drop `tls_disable`) or
place it behind a reverse proxy that terminates HTTPS. Never serve production secrets over plain
HTTP.

:::

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the API port OpenBao serves and
add it to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8200/tcp
```

## Next steps

- [OpenBao documentation](https://openbao.org/docs/)
- [OpenBao installation guide](https://openbao.org/docs/install/)

---
title: SeaweedFS
---

SeaweedFS is an open-source distributed file and object storage system built for billions of files
and fast access. A single `weed` binary runs the master, volume, filer, and S3 components, and the
S3 gateway exposes an S3-compatible API for application workloads.

:::note[Coming soon]

A pre-built SeaweedFS image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install SeaweedFS yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 4           |
| RAM      | 1 GB    | 4 GB        |
| Storage  | 20 GB   | 200 GB      |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab, search for
   **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from **Instances →
   Create**. Either way you get a clean Ubuntu 24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install SeaweedFS

SeaweedFS ships as a single static binary on its GitHub releases page. Download the latest
`linux_amd64` build, extract the `weed` executable, and install it into your `PATH`:

```bash
curl -fsSL https://github.com/seaweedfs/seaweedfs/releases/latest/download/linux_amd64.tar.gz \
  -o /tmp/seaweedfs.tar.gz
sudo tar -xzf /tmp/seaweedfs.tar.gz -C /usr/local/bin weed
sudo chmod +x /usr/local/bin/weed
weed version
```

Create a dedicated user and a data directory:

```bash
sudo useradd --system --home /var/lib/seaweedfs --shell /usr/sbin/nologin seaweedfs
sudo mkdir -p /var/lib/seaweedfs
sudo chown -R seaweedfs:seaweedfs /var/lib/seaweedfs
```

## Configure SeaweedFS

`weed server` runs the master, volume, and filer in one process. Adding `-s3` also starts the S3
gateway. Run it as a systemd service so it starts on boot. Create the unit file:

```bash
sudo tee /etc/systemd/system/seaweedfs.service > /dev/null <<'EOF'
[Unit]
Description=SeaweedFS
After=network.target

[Service]
Type=simple
User=seaweedfs
Group=seaweedfs
ExecStart=/usr/local/bin/weed server -dir=/var/lib/seaweedfs -filer -s3
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now seaweedfs
sudo systemctl status seaweedfs
```

The components listen on these default ports:

| Component  | Port |
| ---------- | ---- |
| Master     | 9333 |
| Volume     | 8080 |
| Filer      | 8888 |
| S3 gateway | 8333 |

Point any S3 client at `http://<your-vm-ip>:8333`. Browse the master dashboard at
`http://<your-vm-ip>:9333` and the filer at `http://<your-vm-ip>:8888`.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) SeaweedFS needs and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 9333/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 8888/tcp
sudo ufw allow 8333/tcp
```

## Next steps

- [SeaweedFS documentation](https://github.com/seaweedfs/seaweedfs/wiki)
- [SeaweedFS installation guide](https://github.com/seaweedfs/seaweedfs/wiki/Getting-Started)

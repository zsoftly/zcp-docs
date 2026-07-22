---
title: SeaweedFS
---

SeaweedFS is an open-source distributed file and object storage system built for billions of files
and fast access. A single `weed` binary runs the master, volume, filer, and S3 components, and the
S3 gateway exposes an S3-compatible API for application workloads.

## Software included

| Component | Version   |
| --------- | --------- |
| SeaweedFS | 4.39      |
| Ubuntu    | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the S3-compatible API credentials and starts the
all-in-one `weed mini` service. Track progress:

```bash
sudo journalctl -u seaweedfs-first-boot.service -f
```

The login message (MOTD) confirms when SeaweedFS is ready. You can also verify the service directly:

```bash
systemctl status seaweedfs
```

### 3. Retrieve the S3-compatible API credentials

The generated credentials and endpoints are stored in a root-only file:

```bash
sudo cat /etc/seaweedfs/credentials.txt
```

| Field      | Value                            |
| ---------- | -------------------------------- |
| Access key | Generated securely on first boot |
| Secret key | Generated securely on first boot |

### 4. Access SeaweedFS

The image starts these endpoints:

| Component         | Endpoint                    |
| ----------------- | --------------------------- |
| S3-compatible API | `http://<your-vm-ip>:8333`  |
| Filer UI          | `http://<your-vm-ip>:8888`  |
| Master UI         | `http://<your-vm-ip>:9333`  |
| Volume            | `http://<your-vm-ip>:9340`  |
| WebDAV            | `http://<your-vm-ip>:7333`  |
| Admin UI          | `http://<your-vm-ip>:23646` |

## Managing SeaweedFS

```bash
# Check service status
systemctl status seaweedfs

# Restart
sudo systemctl restart seaweedfs

# View logs
sudo journalctl -u seaweedfs -f
```

| Path                             | Purpose                             |
| -------------------------------- | ----------------------------------- |
| `/etc/seaweedfs/seaweedfs.env`   | S3-compatible API credentials       |
| `/var/lib/seaweedfs/`            | Persistent SeaweedFS data           |
| `/etc/seaweedfs/credentials.txt` | Generated credentials and endpoints |

## Security

SeaweedFS uses ports 8333, 8888, 9333, 9340, 7333, and 23646 for its S3, filer, master, volume,
WebDAV, and admin endpoints. UFW is enabled and allows SSH (port 22) only by default. All SeaweedFS
ports remain blocked until you allow trusted sources.

**To allow the S3-compatible API and Filer UI from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 8333
sudo ufw allow from <trusted-ip> to any port 8888
```

**To access those endpoints without opening the firewall, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8333:localhost:8333 -L 8888:localhost:8888 ubuntu@<your-vm-ip>

# Then use these local endpoints
http://localhost:8333
http://localhost:8888
```

**For production use**, keep SeaweedFS on a private network or place the required HTTP endpoints
behind a reverse proxy so you can serve them over HTTPS with a trusted TLS certificate.

:::caution

Treat the S3-compatible API credentials as secrets. Open only the endpoints your workloads require
and restrict them to trusted application and administrator networks.

:::

## Next steps

- [SeaweedFS documentation](https://github.com/seaweedfs/seaweedfs/wiki)
- [SeaweedFS installation guide](https://github.com/seaweedfs/seaweedfs/wiki/Getting-Started)

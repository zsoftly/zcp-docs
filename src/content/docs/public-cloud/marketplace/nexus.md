---
title: Nexus
---

Sonatype Nexus Repository is an artifact and package repository manager for storing and proxying
binaries such as Maven, npm, NuGet, Docker, and PyPI components. It gives your build pipelines a
single, reliable source for dependencies and release artifacts. The web UI runs on port 8081.

:::note[Coming soon]

A pre-built Nexus image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Nexus yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 40 GB   | 100 GB      |

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

## Install Nexus

The current Nexus Repository bundle ships with its own JVM, but installing a supported OpenJDK 21 is
recommended for tooling and troubleshooting:

```bash
sudo apt install -y openjdk-21-jre
java -version
```

Create a dedicated `nexus` system user:

```bash
sudo useradd -r -m -U -d /opt/nexus -s /bin/bash nexus
```

Download and extract the latest Nexus Repository tarball into `/opt`:

```bash
cd /tmp
curl -L -O https://download.sonatype.com/nexus/3/latest-unix.tar.gz
sudo tar -xzf latest-unix.tar.gz -C /opt
```

The archive extracts two directories: a versioned `nexus-<version>` application directory and a
`sonatype-work` data directory. Create stable symlinks and set ownership:

```bash
sudo ln -s /opt/nexus-* /opt/nexus-app
sudo chown -R nexus:nexus /opt/nexus-* /opt/sonatype-work
```

Tell Nexus to run as the `nexus` user:

```bash
echo 'run_as_user="nexus"' | sudo tee /opt/nexus-app/bin/nexus.rc
```

Create a systemd service at `/etc/systemd/system/nexus.service`:

```bash
sudo tee /etc/systemd/system/nexus.service > /dev/null <<'EOF'
[Unit]
Description=Sonatype Nexus Repository
After=network.target

[Service]
Type=forking
LimitNOFILE=65536
ExecStart=/opt/nexus-app/bin/nexus start
ExecStop=/opt/nexus-app/bin/nexus stop
User=nexus
Group=nexus
Restart=on-abort
TimeoutSec=600

[Install]
WantedBy=multi-user.target
EOF
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now nexus
sudo systemctl status nexus
```

## Configure Nexus

Nexus listens on port 8081. The first start takes a minute or two to initialize. Open
`http://<your-vm-ip>:8081` in a browser and click **Sign in**. The initial admin username is `admin`
and the generated password is written to a file inside the data directory:

```bash
sudo cat /opt/sonatype-work/nexus3/admin.password
```

Paste that value, then follow the setup wizard to set a new admin password and choose your anonymous
access policy. For a production setup, put Nexus behind a reverse proxy such as nginx with a TLS
certificate and serve the UI over HTTPS instead of exposing port 8081 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Nexus needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8081/tcp
```

## Next steps

- [Nexus documentation](https://help.sonatype.com/en/sonatype-nexus-repository.html)
- [Nexus installation guide](https://help.sonatype.com/en/installation.html)

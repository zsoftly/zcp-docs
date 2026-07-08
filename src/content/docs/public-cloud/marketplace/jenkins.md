---
title: Jenkins
---

Jenkins is an open-source automation server for building, testing, and deploying software. Its
pipeline-as-code model and large plugin ecosystem let you wire up continuous integration and
continuous delivery for almost any toolchain. The web UI runs on port 8080.

## Software included

| Component | Version       |
| --------- | ------------- |
| Jenkins   | 2.555.3 (LTS) |
| OpenJDK   | 21 (JRE)      |
| Ubuntu    | 24.04 LTS     |

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 50 GB       |

## Environment variables

You can optionally set these when deploying Jenkins from the marketplace. Leave a password field
blank to have a secure random value generated automatically.

| Variable                 | Description                            |
| ------------------------ | -------------------------------------- |
| `JENKINS_ADMIN_USER`     | Username for the initial admin account |
| `JENKINS_ADMIN_PASSWORD` | Password for the initial admin account |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script starts Jenkins, which generates a unique initial admin password
for this instance. This can take a few minutes on the first start. Track progress:

```bash
journalctl -u jenkins-first-boot.service -f
```

The login message (MOTD) confirms when Jenkins is ready.

### 3. Retrieve the initial admin password

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### 4. Complete the setup wizard

Open a browser and navigate to:

```text
http://<your-vm-ip>:8080
```

Paste the initial admin password, install the suggested plugins, and create your first administrator
account.

## Managing Jenkins

Jenkins runs as a systemd service.

```bash
# Check status
systemctl status jenkins

# Restart
sudo systemctl restart jenkins

# View logs
sudo journalctl -u jenkins -f
```

Jenkins home (jobs, plugins, and configuration): `/var/lib/jenkins`.

## Security

Port 8080 is open on the VM's network interface. UFW is enabled and allows SSH (port 22) and Jenkins
(port 8080). No build-agent port (50000) is opened by default.

**To restrict the UI to a specific IP:**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**To reach the UI without opening the firewall, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>
```

**For production use**, place Jenkins behind a reverse proxy such as nginx with a TLS certificate
and serve the UI over HTTPS instead of exposing port 8080 directly.

## Next steps

- [Jenkins documentation](https://www.jenkins.io/doc/)
- [Managing plugins](https://www.jenkins.io/doc/book/managing/plugins/)
- [Pipeline reference](https://www.jenkins.io/doc/book/pipeline/)

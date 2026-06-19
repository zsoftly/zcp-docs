---
title: Jenkins
---

Jenkins is an open-source automation server for building, testing, and deploying software. Its
pipeline-as-code model and large plugin ecosystem let you wire up continuous integration and
continuous delivery for almost any toolchain. The web UI runs on port 8080.

:::note[Coming soon]

A pre-built Jenkins image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Jenkins yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 50 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Jenkins**, and click **Deploy**, or create
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

## Install Jenkins

Jenkins runs on the JVM. Install a supported OpenJDK (17 or 21) first:

```bash
sudo apt install -y fontconfig openjdk-21-jre
java -version
```

Add the Jenkins LTS apt repository signing key and source list:

```bash
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" \
  | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
```

Install Jenkins:

```bash
sudo apt update
sudo apt install -y jenkins
```

The package installs a systemd service that starts on boot. Confirm it is running:

```bash
sudo systemctl enable --now jenkins
sudo systemctl status jenkins
```

## Configure Jenkins

Jenkins listens on port 8080. Open `http://<your-vm-ip>:8080` in a browser to start the setup
wizard. The wizard first asks for the auto-generated setup password. Print it from the server:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Paste the value, install the suggested plugins, and create your first administrator account. For a
production setup, put Jenkins behind a reverse proxy such as nginx with a TLS certificate, then
serve the UI over HTTPS instead of exposing port 8080 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Jenkins needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8080/tcp
```

## Next steps

- [Jenkins documentation](https://www.jenkins.io/doc/)
- [Jenkins installation guide](https://www.jenkins.io/doc/book/installing/linux/)

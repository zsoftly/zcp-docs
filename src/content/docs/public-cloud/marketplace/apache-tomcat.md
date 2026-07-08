---
title: Apache Tomcat
---

Apache Tomcat is an open-source servlet container that runs Java web applications. It implements the
Jakarta Servlet, JSP, and WebSocket specifications and serves WAR files over HTTP, making it a
standard choice for hosting Java backends.

:::note[Coming soon]

A pre-built Apache Tomcat image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Apache Tomcat yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 10 GB   | 20 GB       |

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

## Install Apache Tomcat

Tomcat 11 requires Java 17 or later. Install OpenJDK 21 first:

```bash
sudo apt install -y openjdk-21-jdk
```

Create a dedicated `tomcat` user and download Tomcat 11 from the official mirror:

```bash
sudo useradd -r -m -U -d /opt/tomcat -s /bin/false tomcat
```

```bash
cd /tmp
curl -fSLO https://dlcdn.apache.org/tomcat/tomcat-11/v11.0.22/bin/apache-tomcat-11.0.22.tar.gz
sudo tar -xzf apache-tomcat-11.0.22.tar.gz -C /opt/tomcat --strip-components=1
```

Set ownership and make the scripts executable:

```bash
sudo chown -R tomcat:tomcat /opt/tomcat
sudo chmod +x /opt/tomcat/bin/*.sh
```

Create a systemd service so Tomcat starts on boot:

```bash
sudo tee /etc/systemd/system/tomcat.service >/dev/null <<'EOF'
[Unit]
Description=Apache Tomcat 11
After=network.target

[Service]
Type=forking
User=tomcat
Group=tomcat
Environment="JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64"
Environment="CATALINA_HOME=/opt/tomcat"
Environment="CATALINA_BASE=/opt/tomcat"
Environment="CATALINA_PID=/opt/tomcat/temp/tomcat.pid"
ExecStart=/opt/tomcat/bin/startup.sh
ExecStop=/opt/tomcat/bin/shutdown.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

Reload systemd and start Tomcat:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now tomcat
```

Tomcat now listens on port 8080. Verify it:

```bash
curl -I http://localhost:8080
```

## Configure Apache Tomcat

To use the Manager and Host Manager apps, add an admin user in `/opt/tomcat/conf/tomcat-users.xml`,
inside the `<tomcat-users>` element:

```xml
<role rolename="manager-gui"/>
<role rolename="admin-gui"/>
<user username="admin" password="ChangeMeNow" roles="manager-gui,admin-gui"/>
```

By default the Manager app only accepts connections from localhost. To reach it from your browser,
comment out the `RemoteAddrValve` in `/opt/tomcat/webapps/manager/META-INF/context.xml` (and the
Host Manager equivalent). Restrict access by IP or a reverse proxy in production rather than
removing the valve outright. Restart to apply the changes:

```bash
sudo systemctl restart tomcat
```

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Apache Tomcat needs
and add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8080/tcp
```

For production, run Tomcat behind a reverse proxy such as Nginx or HAProxy on ports 80/443 instead
of exposing 8080 directly.

## Next steps

- [Apache Tomcat documentation](https://tomcat.apache.org/tomcat-11.0-doc/index.html)
- [Apache Tomcat installation guide](https://tomcat.apache.org/tomcat-11.0-doc/setup.html)

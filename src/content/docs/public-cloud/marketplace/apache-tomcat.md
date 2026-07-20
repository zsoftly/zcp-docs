---
title: Apache Tomcat
---

Apache Tomcat is an open-source servlet container that runs Java web applications. It implements the
Jakarta Servlet, JSP, and WebSocket specifications and serves WAR files over HTTP, making it a
standard choice for hosting Java backends.

## Software included

| Component     | Version   |
| ------------- | --------- |
| Apache Tomcat | 11.0.24   |
| OpenJDK       | 21 (JRE)  |
| Ubuntu        | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script creates the Manager and Host Manager administrator, starts Tomcat,
and writes the credentials to disk. This takes about a minute. Track progress:

```bash
journalctl -u tomcat-first-boot.service -f
```

The login message (MOTD) confirms when Tomcat is ready.

### 3. Verify Apache Tomcat is running

```bash
systemctl status tomcat
curl -I http://localhost:8080
```

### 4. Access Apache Tomcat

Open a browser and navigate to:

```text
http://<your-vm-ip>:8080
```

Retrieve the Manager credentials:

```bash
sudo cat /root/.credentials/tomcat.txt
```

| Field    | Value                                |
| -------- | ------------------------------------ |
| Username | `admin`                              |
| Password | From `/root/.credentials/tomcat.txt` |

The Manager and Host Manager apps accept localhost connections only. Use the SSH tunnel shown in the
credentials file to access them.

## Managing Apache Tomcat

```bash
# Check service status
systemctl status tomcat

# Restart
sudo systemctl restart tomcat

# View logs
sudo journalctl -u tomcat -f
```

| Path                                | Purpose                             |
| ----------------------------------- | ----------------------------------- |
| `/opt/tomcat/conf/tomcat-users.xml` | Manager users and roles             |
| `/opt/tomcat/webapps/`              | Deployed applications and WAR files |
| `/opt/tomcat/logs/`                 | Tomcat logs                         |

## Security

Port 8080 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) and
Tomcat (port 8080) by default. The Manager and Host Manager apps remain restricted to localhost by
Tomcat.

**To restrict Tomcat to a specific IP:**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**To access Tomcat without exposing port 8080, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
http://localhost:8080/manager/html
```

**For production use**, place Tomcat behind a reverse proxy such as Nginx or HAProxy so you can
serve it on port 443 with a TLS certificate.

## Next steps

- [Apache Tomcat documentation](https://tomcat.apache.org/tomcat-11.0-doc/index.html)
- [Apache Tomcat installation guide](https://tomcat.apache.org/tomcat-11.0-doc/setup.html)

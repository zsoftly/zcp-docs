---
title: Ghost
---

Ghost is an open-source publishing platform for blogs, newsletters, and membership sites. It pairs a
fast editor and built-in email delivery with a clean, theme-driven front end. The official
`ghost-cli` tool installs and manages a production deployment on Ubuntu.

:::note[Coming soon]

A pre-built Ghost image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Ghost yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab. It opens on
   **Featured** by default, so select **Marketplace** next to it. Pick your region (YOW-1 or YUL-1),
   search for **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from
   **Instances → Create**. Either way you get a clean Ubuntu 24.04 VM.

   ![The Marketplace tab in the ZSoftly Cloud portal, showing the region selector, category list, search box, and Deploy buttons](../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Searching the Marketplace for an app, with the search box filtering the catalog down to a matching Deploy card](../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choose a plan that meets the requirements above.

3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Ghost

Ghost's official guide targets **Ubuntu 24.04 LTS**. A production install requires **nginx**,
**MySQL 8**, an LTS version of **Node.js**, and a registered **domain name**. Ghost errors out when
installed against a bare IP address.

Install nginx and MySQL 8:

```bash
sudo apt install -y nginx mysql-server
sudo ufw allow 'Nginx Full'
```

Install a supported Node.js LTS (Ghost supports the active LTS lines, this example uses 22):

```bash
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
  | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
  | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update && sudo apt-get install -y nodejs
```

Install the Ghost CLI globally:

```bash
sudo npm install ghost-cli@latest -g
```

Create the install directory (owned by the `ubuntu` user) and run the installer from inside it:

```bash
sudo mkdir -p /var/www/ghost
sudo chown ubuntu:ubuntu /var/www/ghost
sudo chmod 775 /var/www/ghost
cd /var/www/ghost
ghost install
```

## Configure Ghost

`ghost install` is interactive. It prompts for your site URL (use `https://your-domain.com`),
configures the MySQL database, sets up the systemd service and the nginx virtual host, and offers to
provision a free Let's Encrypt TLS certificate. Accept it for a production site.

When prompted for the MySQL connection, supply the root password you set above. Ghost creates its
own database and user. After install, complete admin setup at:

```text
https://your-domain.com/ghost
```

Manage the instance with `ghost` commands from `/var/www/ghost` (`ghost ls`, `ghost stop`,
`ghost start`, `ghost restart`).

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Ghost needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Next steps

- [Ghost documentation](https://docs.ghost.org/)
- [Ghost installation guide](https://docs.ghost.org/install/ubuntu)

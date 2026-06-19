---
title: Zabbix
---

Zabbix is an enterprise-grade, open-source monitoring platform for networks, servers, cloud
services, and applications. It collects metrics through agents, SNMP, IPMI, and agentless checks,
then provides alerting, visualization, and dashboards from a single web frontend. This guide
installs the Zabbix server, web frontend, and agent with a MySQL backend on Apache.

:::note[Coming soon]

A pre-built Zabbix image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Zabbix yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 30 GB   | 60 GB       |

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

## Install Zabbix

Install the MySQL database server and Apache first:

```bash
sudo apt install -y mysql-server apache2
```

Add the official Zabbix repository. Zabbix 7.4 is the current stable release. Install the Ubuntu
24.04 (`noble`) `zabbix-release` deb:

```bash
wget https://repo.zabbix.com/zabbix/7.4/release/ubuntu/pool/main/z/zabbix-release/zabbix-release_latest_7.4+ubuntu24.04_all.deb
sudo dpkg -i zabbix-release_latest_7.4+ubuntu24.04_all.deb
sudo apt update
```

Install the Zabbix server, frontend, and agent packages:

```bash
sudo apt install -y zabbix-server-mysql zabbix-frontend-php \
  zabbix-apache-conf zabbix-sql-scripts zabbix-agent2
```

## Configure Zabbix

1. Create the Zabbix database and user in MySQL:

   ```bash
   sudo mysql -uroot -e "CREATE DATABASE zabbix CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"
   sudo mysql -uroot -e "CREATE USER 'zabbix'@'localhost' IDENTIFIED BY 'ChangeThisPassword';"
   sudo mysql -uroot -e "GRANT ALL PRIVILEGES ON zabbix.* TO 'zabbix'@'localhost';"
   sudo mysql -uroot -e "SET GLOBAL log_bin_trust_function_creators = 1;"
   ```

2. Import the initial schema and data (you will be prompted for the `zabbix` password):

   ```bash
   sudo zcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz \
     | mysql --default-character-set=utf8mb4 -uzabbix -p zabbix
   ```

3. Disable the function-creator flag again:

   ```bash
   sudo mysql -uroot -e "SET GLOBAL log_bin_trust_function_creators = 0;"
   ```

4. Set the database password in `/etc/zabbix/zabbix_server.conf` by uncommenting and editing the
   `DBPassword=` line to match the password above.
5. Start and enable all services:

   ```bash
   sudo systemctl restart zabbix-server zabbix-agent2 apache2
   sudo systemctl enable zabbix-server zabbix-agent2 apache2
   ```

6. Open `http://<your-vm-ip>/zabbix` in your browser and complete the web setup wizard (database
   connection, server details, timezone).
7. Log in with the default credentials **Admin** / **zabbix**, then immediately change the Admin
   password under **Users → Users**.
8. For production, configure Apache with your domain and a TLS certificate so the frontend is served
   over HTTPS on port 443.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the ports Zabbix needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 10051/tcp
```

Port 80/443 serves the web frontend. Port 10051 is the Zabbix server port used by active agents and
proxies reporting in.

## Next steps

- [Zabbix documentation](https://www.zabbix.com/documentation/current/)
- [Zabbix installation guide](https://www.zabbix.com/download)

---
title: ERPNext
---

ERPNext is a free, open-source ERP suite built on the Frappe framework. It covers accounting,
inventory, manufacturing, CRM, HR, projects, and more in a single web application. The easiest way
to run it is with the official `frappe_docker` images via Docker Compose.

:::note[Coming soon]

A pre-built ERPNext image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install ERPNext yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 40 GB   | 80 GB       |

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

## Install ERPNext

Install Docker and the Compose plugin:

```bash
sudo apt install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ubuntu
```

Log out and back in (or run `newgrp docker`) so the group change takes effect.

Clone `frappe_docker` and start the stack:

```bash
git clone https://github.com/frappe/frappe_docker
cd frappe_docker
docker compose -f pwd.yml up -d
```

The `pwd.yml` stack pulls the ERPNext images and runs a `create-site` job that builds the default
site. This takes a few minutes. Watch progress with:

```bash
docker compose -f pwd.yml logs -f create-site
```

:::caution

`pwd.yml` is the official quick-start for evaluation. For a production deployment with your own
database, custom apps, and a reverse proxy, follow the
[production setup](https://github.com/frappe/frappe_docker/blob/main/docs/setup_production.md) using
`compose.yaml` and the override files. The `bench` CLI is the non-Docker alternative. See the
[bench installation guide](https://docs.frappe.io/framework/user/en/installation).

:::

## Configure ERPNext

Once the `create-site` job finishes, open `http://<your-vm-ip>:8080` and log in:

- Username: `Administrator`
- Password: `admin`

Change the Administrator password immediately, then complete the setup wizard (company, currency,
fiscal year). For production, put ERPNext behind a reverse proxy (Traefik or Nginx) with a TLS
certificate and a real domain name rather than serving port 8080 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) ERPNext needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8080/tcp
```

If you front ERPNext with a reverse proxy over HTTPS, open `80` and `443` instead and keep `8080`
internal.

## Next steps

- [ERPNext documentation](https://docs.frappe.io/erpnext)
- [frappe_docker installation guide](https://github.com/frappe/frappe_docker/blob/main/docs/getting-started.md)

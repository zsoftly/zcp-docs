---
title: Node.js 24
---

This image provides a clean Ubuntu 24.04 environment with Node.js 24 LTS and PM2 pre-installed. It
is designed for deploying Node.js applications that need to run persistently as a managed process.

## Software included

| Component | Version              |
| --------- | -------------------- |
| Node.js   | 24.x (LTS)           |
| npm       | Bundled with Node.js |
| PM2       | Latest stable        |
| Ubuntu    | 24.04 LTS            |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Verify the installation

There is no first-boot configuration. Node.js and PM2 are ready immediately.

```bash
node --version
npm --version
pm2 --version
```

### 3. Deploy your application

Upload your application files to the VM, then start your app with PM2:

```bash
# Start your app
pm2 start app.js --name my-app

# Save the process list so it survives reboots
pm2 save
pm2 startup
```

Run the command that `pm2 startup` outputs to register PM2 with systemd.

## Managing your application with PM2

```bash
# List running processes
pm2 list

# View logs
pm2 logs my-app

# Restart
pm2 restart my-app

# Stop
pm2 stop my-app

# Delete from PM2
pm2 delete my-app
```

## Security

No application ports are open by default. UFW is enabled and allows SSH (port 22) only.

**To allow traffic on your application's port:**

```bash
sudo ufw allow <your-app-port>/tcp
```

**For a web application**, consider placing it behind Nginx or Caddy as a reverse proxy so you can
serve HTTPS on port 443 and proxy requests to your Node.js app internally.

## Next steps

- [Node.js documentation](https://nodejs.org/docs/latest/api/)
- [PM2 documentation](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)
- [npm documentation](https://docs.npmjs.com/)

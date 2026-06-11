---
title: OpenClaw
---

OpenClaw is a Node.js-based tool for building and running automated workflows and integrations. This
image ships Node.js 24 with the OpenClaw package pre-installed globally, ready for you to configure
with your API keys and channels.

## Software included

| Component | Version       |
| --------- | ------------- |
| OpenClaw  | Latest stable |
| Node.js   | 24.x          |
| Ubuntu    | 24.04 LTS     |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Verify the installation

There is no first-boot configuration — OpenClaw and Node.js are ready immediately.

```bash
openclaw --version
node --version
```

### 3. Configure OpenClaw

OpenClaw requires your API keys and channel configuration before it can run. Refer to the OpenClaw
documentation for the configuration format and required credentials for your integrations.

```bash
openclaw --help
```

### 4. Start OpenClaw

```bash
openclaw start
```

OpenClaw listens on port **18789** by default.

## Managing OpenClaw

To run OpenClaw persistently and survive reboots, manage it with PM2 (not included — install with
npm):

```bash
sudo npm install -g pm2
pm2 start openclaw --name openclaw -- start
pm2 save
pm2 startup
```

Run the command that `pm2 startup` outputs to register PM2 with systemd.

## Security

Port 18789 is **not** open externally by default. UFW is enabled and allows SSH (port 22) only.

**To allow access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 18789
```

**To access OpenClaw without opening the firewall, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 18789:localhost:18789 ubuntu@<your-vm-ip>
```

## Next steps

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Node.js documentation](https://nodejs.org/docs/latest/api/)

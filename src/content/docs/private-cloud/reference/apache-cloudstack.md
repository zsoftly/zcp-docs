---
title: Apache CloudStack
sidebar_position: 1
---

# Apache CloudStack Reference

Apache CloudStack is the cloud orchestration platform at the core of ZSoftly Private Cloud.

## Version

Your credentials document specifies the exact CloudStack version deployed in your environment.

## Official documentation

| Resource            | URL                                                        |
| ------------------- | ---------------------------------------------------------- |
| Installation Guide  | https://docs.cloudstack.apache.org/en/latest/installguide/ |
| Administrator Guide | https://docs.cloudstack.apache.org/en/latest/adminguide/   |
| User Guide          | https://docs.cloudstack.apache.org/en/latest/userguide/    |
| API Reference       | https://cloudstack.apache.org/api.html                     |
| Release Notes       | https://docs.cloudstack.apache.org/en/latest/releasenotes/ |

ZSoftly does not maintain a mirror of CloudStack documentation. The official documentation above is
authoritative.

## CloudMonkey (cmk)

CloudMonkey is the official CloudStack CLI. ZSoftly uses the **Go binary** (v6.5.0), not the Python
package.

### Install

**Linux:**

```bash
ARCH=$(uname -m)
case "$ARCH" in
  x86_64)  BINARY="cmk.linux.x86-64" ;;
  aarch64) BINARY="cmk.linux.arm64" ;;
  armv7l)  BINARY="cmk.linux.arm32" ;;
  i686)    BINARY="cmk.linux.x86" ;;
  *)       echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac
wget "https://github.com/apache/cloudstack-cloudmonkey/releases/download/6.5.0/${BINARY}"
chmod +x "$BINARY"
sudo mv "$BINARY" /usr/local/bin/cmk
cmk version
```

**macOS:**

```bash
ARCH=$(uname -m)
case "$ARCH" in
  arm64)  BINARY="cmk.darwin.arm64" ;;
  x86_64) BINARY="cmk.darwin.x86-64" ;;
  *)      echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac
curl -LO "https://github.com/apache/cloudstack-cloudmonkey/releases/download/6.5.0/${BINARY}"
chmod +x "$BINARY"
sudo mv "$BINARY" /usr/local/bin/cmk
cmk version
```

**Windows:** Download the `.exe` from the
[releases page](https://github.com/apache/cloudstack-cloudmonkey/releases/tag/6.5.0), rename to
`cmk.exe`, and add its folder to `PATH`.

### Configure

Your management server URL is in the credentials document provided at handover.

```bash
cmk set profile admin
cmk set url https://<your-management-server>/client/api
cmk set output json
cmk set asyncblock true
cmk set apikey <your-api-key>
cmk set secretkey <your-secret-key>
```

Sync the API cache once after first configure:

```bash
cmk sync
```

Config is saved to `$HOME/.cmk/config`.

### Get API credentials

In the CloudStack UI: top-right username menu → **View API credentials**.

### Verify

```bash
cmk list zones | grep -o '"name": "[^"]*"'
```

### Usage examples

```bash
cmk list zones
cmk list virtualmachines listall=true
cmk list routers listall=true
cmk listCapabilities | grep cloudstackversion
```

Full reference:
[github.com/apache/cloudstack-cloudmonkey](https://github.com/apache/cloudstack-cloudmonkey)

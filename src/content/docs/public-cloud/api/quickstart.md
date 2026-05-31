---
title: API Quickstart
sidebar_position: 2
---

## API Quickstart

Authenticate and make your first API calls.

### 1. Get a token

```bash
TOKEN=$(curl -s -X POST https://api.zcp.zsoftly.ca/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your-password"}' \
  | jq -r '.token')

echo $TOKEN
```

### 2. List your instances

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.zcp.zsoftly.ca/api/instances | jq .
```

### 3. Create an instance

```bash
curl -s -X POST https://api.zcp.zsoftly.ca/api/instances \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-server",
    "template_id": "ubuntu-24-04",
    "plan_id": "gc-1vcpu-1gb",
    "region_id": "yow",
    "network_id": "my-network-id",
    "billing_cycle": "hourly"
  }' | jq .
```

### Python example

```python
import requests

BASE = "https://api.zcp.zsoftly.ca/api"

# Authenticate
resp = requests.post(f"{BASE}/auth/login", json={
    "email": "your@email.com",
    "password": "your-password"
})
token = resp.json()["token"]
headers = {"Authorization": f"Bearer {token}"}

# List instances
instances = requests.get(f"{BASE}/instances", headers=headers).json()
for inst in instances:
    print(inst["name"], inst["status"])
```

### Full API Reference

The complete interactive API reference is available at:

- **Cloud Platform API**:
  [api.zcp.zsoftly.ca/api/docs/nimbo](https://api.zcp.zsoftly.ca/api/docs/nimbo)
- **Object Storage API**:
  [api.zcp.zsoftly.ca/api/docs/ceph](https://api.zcp.zsoftly.ca/api/docs/ceph)

See also: [Authentication](./authentication), [API Reference](./reference)

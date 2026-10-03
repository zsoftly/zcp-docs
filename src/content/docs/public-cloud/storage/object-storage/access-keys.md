---
title: Access Keys
sidebar_position: 2
---

## Object Storage Access Keys

Your object storage instance has S3-compatible credentials that allow programmatic access via any
S3-compatible tool or SDK.

### S3 endpoints

| Region         | Endpoint                             |
| -------------- | ------------------------------------ |
| YUL (Montreal) | `https://objects.yul.zcp.zsoftly.ca` |
| YOW (Ottawa)   | `https://objects.yow.zcp.zsoftly.ca` |

The endpoint for your instance matches the region you selected when creating it.

### Create and rotate access keys

1. From the **Object Storage** list, find your instance.
2. Click the **Credentials** icon (key icon in the actions row).
3. Create an access key and copy its secret within five minutes.

Use the CLI to list key metadata, create a key, and revoke a key:

```bash
zcp object-storage keys list <storage-slug>
zcp object-storage keys create <storage-slug>
zcp object-storage keys delete <storage-slug> <key-id> -y
```

Each store supports one or two active keys. To rotate a key, create a second key, update every
application that uses the old key, then revoke the old key. You cannot revoke the last active key.

:::caution

The secret is available only for five minutes after key creation. The CLI never decrypts or recovers
an earlier secret. Save it securely when you create the key.

Hiding a secret does not revoke it. Revocation disables the key in object storage and marks it
revoked in the control plane.

:::

### Use credentials with AWS CLI

Configure a named profile for your ZSoftly object storage:

```bash
aws configure --profile zsoftly
# AWS Access Key ID: <your access key>
# AWS Secret Access Key: <your secret key>
# Default region name: (leave blank)
# Default output format: json
```

Then pass the endpoint when running commands:

```bash
# YUL (Montreal)
aws s3 ls --profile zsoftly --endpoint-url https://objects.yul.zcp.zsoftly.ca

# YOW (Ottawa)
aws s3 ls --profile zsoftly --endpoint-url https://objects.yow.zcp.zsoftly.ca
```

### Use credentials with environment variables

```bash
export AWS_ACCESS_KEY_ID="<your access key>"
export AWS_SECRET_ACCESS_KEY="<your secret key>"

# Set the endpoint for your region
export AWS_ENDPOINT_URL="https://objects.yul.zcp.zsoftly.ca"
```

For direct S3 commands through `zcp`, save the new credentials in these variables:

```bash
export ZCP_S3_ACCESS_KEY="<your access key>"
export ZCP_S3_SECRET_KEY="<your secret key>"
```

The CLI checks that `ZCP_S3_ACCESS_KEY` is active for the selected store before it connects.

See also: [Create Bucket](/public-cloud/storage/object-storage/create-bucket),
[S3 Usage](/public-cloud/storage/object-storage/s3-usage/)

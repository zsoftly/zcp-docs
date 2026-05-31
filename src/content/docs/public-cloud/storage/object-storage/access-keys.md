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

### View your credentials

1. From the **Object Storage** list, find your instance.
2. Click the **Credentials** icon (key icon in the actions row).
3. The panel shows:
   - **Access Key ID**: your S3 access key
   - **Secret Access Key**: your S3 secret key (treat this like a password)

:::caution

Store your secret key securely. It is shown once and cannot be recovered. If lost, you must generate
new credentials.

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

See also: [Create Bucket](./create-bucket), [S3 Usage](./s3-usage)

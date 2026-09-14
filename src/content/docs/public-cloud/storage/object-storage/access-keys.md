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

You can also read both keys from the CLI at any time:

```bash
zcp object-storage get <storage-slug> --region os-yul --project <project-slug>
```

The output includes the S3 endpoint, the access key, and the secret key.

:::caution

The secret key is not write-once. Any holder of an API token for the project can print it with
`zcp object-storage get`, so treat an API token as equivalent to the S3 credentials it can reveal.
Scope tokens accordingly, and rotate the object storage credentials if a token is exposed.

Store the keys securely wherever you use them. If you need to invalidate them, generate new
credentials for the instance.

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

See also: [Create Bucket](/public-cloud/storage/object-storage/create-bucket),
[S3 Usage](/public-cloud/storage/object-storage/s3-usage/)

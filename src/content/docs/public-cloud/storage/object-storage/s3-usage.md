---
title: S3 API Usage
sidebar_position: 3
---

## S3 API Usage

ZSoftly object storage is S3-compatible (backed by Ceph RGW). Any tool or SDK that supports S3 works
with it.

**Endpoints:**

| Region         | Endpoint                             |
| -------------- | ------------------------------------ |
| YUL (Montreal) | `https://objects.yul.zcp.zsoftly.ca` |
| YOW (Ottawa)   | `https://objects.yow.zcp.zsoftly.ca` |

Examples below use the YUL endpoint. Substitute YOW if your bucket is in Ottawa.

### AWS CLI

```bash
# List buckets
aws s3 ls --endpoint-url https://objects.yul.zcp.zsoftly.ca

# Create a bucket
aws s3 mb s3://my-bucket --endpoint-url https://objects.yul.zcp.zsoftly.ca

# Upload a file
aws s3 cp ./file.txt s3://my-bucket/ --endpoint-url https://objects.yul.zcp.zsoftly.ca

# Download a file
aws s3 cp s3://my-bucket/file.txt ./file.txt --endpoint-url https://objects.yul.zcp.zsoftly.ca

# List objects in a bucket
aws s3 ls s3://my-bucket/ --endpoint-url https://objects.yul.zcp.zsoftly.ca

# Delete an object
aws s3 rm s3://my-bucket/file.txt --endpoint-url https://objects.yul.zcp.zsoftly.ca
```

### Python (boto3)

```python
import boto3

s3 = boto3.client(
    "s3",
    endpoint_url="https://objects.yul.zcp.zsoftly.ca",
    aws_access_key_id="<access-key>",
    aws_secret_access_key="<secret-key>",
)

# List buckets
response = s3.list_buckets()
for bucket in response["Buckets"]:
    print(bucket["Name"])

# Upload a file
s3.upload_file("file.txt", "my-bucket", "file.txt")

# Download a file
s3.download_file("my-bucket", "file.txt", "downloaded.txt")
```

### Node.js (@aws-sdk/client-s3)

```js
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  endpoint: 'https://objects.yul.zcp.zsoftly.ca',
  region: 'us-east-1',
  credentials: {
    accessKeyId: '<access-key>',
    secretAccessKey: '<secret-key>',
  },
  forcePathStyle: true,
});

const { Buckets } = await client.send(new ListBucketsCommand({}));
console.log(Buckets);
```

:::tip Use `forcePathStyle: true` (Node.js) when working with Ceph-backed S3 to ensure
compatibility. :::

See also: [Access Keys](./access-keys), [Create Bucket](./create-bucket)

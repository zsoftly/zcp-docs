---
title: Encrypt Object Storage with the CLI
description: Verify SSE-S3 and managed SSE-KMS bucket defaults with the ZCP CLI.
---

Use ZCP CLI v1.3.0 and an existing object-storage instance in YUL or YOW. This three-part tutorial
creates a private test bucket, verifies SSE-S3 and service-managed SSE-KMS, then cleans up. Existing
buckets also support encryption. Changing defaults leaves existing objects unchanged. There are no
encryption controls in the portal UI.

## 1. Prepare Credentials

Install and authenticate the [CLI](/public-cloud/cli/installation/) using your
[account profile](/public-cloud/cli/configuration/). Also install the
[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) for
metadata checks. Run the following in a private Bash session without terminal recording or debug
logging:

```bash
set +x
unset ZCP_DEBUG
zcp version
zcp project list
export ZCP_REGION=os-yul # Use os-yow for Ottawa.
read -r -p 'Project slug: ' ZCP_PROJECT
export ZCP_PROJECT
zcp object-storage list
read -r -p 'Existing storage slug: ' storage
zcp object-storage keys list "$storage"
```

The account bearer token authorizes control-plane requests. A separate S3 access-key/secret-key pair
authorizes object requests. An SSE-KMS key ID selects a service-managed encryption key.

Before creating anything, obtain the approved regional service-managed KMS key ID from ZSoftly
support. It is not your S3 access key or secret, and this tutorial does not create or import
encryption keys. If you cannot obtain the key ID, stop here: do not create the additional S3 key or
the test bucket.

```bash
read -r -p 'Approved service-managed KMS key ID: ' kms_key_id
```

## 2. Create One Additional S3 Key

Each store allows at most two active keys. Continue only if one slot is free. Never revoke an
existing application key to make room. The new secret is visible for five minutes only.

```bash
zcp object-storage keys create "$storage"
read -r -p 'New key ID (for cleanup): ' temporary_key_id
read -r -s -p 'New S3 access key: ' ZCP_S3_ACCESS_KEY
printf '\n'
read -r -s -p 'New S3 secret key: ' ZCP_S3_SECRET_KEY
printf '\n'
export ZCP_S3_ACCESS_KEY ZCP_S3_SECRET_KEY
export AWS_ACCESS_KEY_ID="$ZCP_S3_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$ZCP_S3_SECRET_KEY"
export AWS_DEFAULT_REGION="$ZCP_REGION"
unset AWS_SESSION_TOKEN AWS_SECURITY_TOKEN
```

Enter the new values without saving them in history or files. Keep this session open. The CLI checks
store/key metadata. Direct S3 uses endpoint credentials and a literal bucket name, regardless of
bucket origin. See [Access Keys](/public-cloud/storage/object-storage/access-keys/) for rotation.

Continue to
[Create the Bucket and Set Encryption Defaults](/tutorials/encrypt-object-storage-defaults/).

---
title: Create the Bucket and Set Encryption Defaults
description:
  Create a private test bucket and upload objects under SSE-S3 and service-managed SSE-KMS defaults.
---

Continue in the Bash session from [Prepare Credentials](/tutorials/encrypt-object-storage/). Use a
new bucket for this walkthrough, without changing an existing bucket's policy or defaults.

## 3. Create a Private Bucket

```bash
requested_bucket="encryption-demo-$(date +%Y%m%d%H%M%S)"
zcp object-storage bucket create "$storage" --name "$requested_bucket"
read -r -p 'SLUG from the creation output: ' bucket_slug
read -r -p 'NAME from the creation output: ' bucket_name
zcp object-storage bucket set-acl "$storage" "$bucket_name" --acl private
zcp object-storage bucket policy get "$storage" "$bucket_name"
endpoint="https://objects.${ZCP_REGION#os-}.zcp.zsoftly.ca"
work_dir=$(mktemp -d "${TMPDIR:-/tmp}/zcp-encryption.XXXXXX")
printf 'Encryption tutorial sample\n' > "$work_dir/payload.txt"
```

Creation prints `SLUG`, `NAME`, `STATUS`, and `CREATED`. Copy the returned values exactly, including
any numeric suffix. Encryption commands use the slug, object commands use the S3 name. The
private-policy check should report no bucket policy. Stop if it shows an unexpected policy.

## 4. Use an SSE-S3 Default

```bash
zcp object-storage bucket encryption enable "$storage" "$bucket_slug" --sse AES256
zcp object-storage bucket encryption status "$storage" "$bucket_slug"
zcp object-storage object put "$storage" "$bucket_name" "$work_dir/payload.txt" --key sse-s3.txt
```

Confirm `AES256` in the default readback. The upload inherits this default without an object flag.
Prefer defaults: explicit per-object `AES256` can fail on first use in YOW.

## 5. Use a Service-Managed SSE-KMS Default

This step uses the approved key ID you entered in
[Prepare Credentials](/tutorials/encrypt-object-storage/#1-prepare-credentials). If `kms_key_id` is
empty or you no longer trust the value, stop before the KMS upload and go to
[Remove Only Tutorial Resources](/tutorials/encrypt-object-storage-verify-cleanup/#7-remove-only-tutorial-resources).
Skip the commands for `sse-kms.txt`, which you did not create.

```bash
zcp object-storage bucket encryption enable "$storage" "$bucket_slug" \
  --sse aws:kms --sse-kms-key-id "$kms_key_id"
zcp object-storage bucket encryption status "$storage" "$bucket_slug"
zcp object-storage object put "$storage" "$bucket_name" "$work_dir/payload.txt" --key sse-kms.txt
```

Confirm `aws:kms` and the approved key ID. This changes subsequent uploads only. The earlier
`sse-s3.txt` object keeps its SSE-S3 encryption.

Continue to [Verify Downloads and Clean Up](/tutorials/encrypt-object-storage-verify-cleanup/).

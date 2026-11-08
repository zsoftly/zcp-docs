---
title: Verify Encrypted Objects and Clean Up
description:
  Check encryption metadata and matching downloads, then remove only the tutorial bucket and
  additional key.
---

Continue in the same session from
[Set Encryption Defaults](/tutorials/encrypt-object-storage-defaults/).

## 6. Verify Metadata and Downloaded Bytes

```bash
for object_key in sse-s3.txt sse-kms.txt; do
  aws s3api head-object --endpoint-url "$endpoint" --bucket "$bucket_name" \
    --key "$object_key" --query '[ServerSideEncryption,SSEKMSKeyId]' &&
  zcp object-storage object download "$storage" "$bucket_name" "$object_key" \
    --dest "$work_dir/$object_key" &&
  cmp "$work_dir/payload.txt" "$work_dir/$object_key" &&
  printf 'Verified %s\n' "$object_key" || break
done
```

Expect `AES256` for the first object and `aws:kms` with the approved key ID for the second. Each
`cmp` exits successfully with no output when the downloaded bytes match. Investigate any metadata
mismatch, download error, or nonzero comparison before using the workflow for real data.

## Copy and Multipart Limits

Bucket defaults do not rewrite existing objects. A single-request copy without encryption settings
does not inherit the destination default. The service refuses single-request copies with encryption
headers or an encrypted source. Use encrypted multipart copy or download and re-upload instead. Set
encryption when initiating a multipart upload or copy. See
[S3 API Usage](/public-cloud/storage/object-storage/s3-usage/#optional-server-side-encryption).

## 7. Remove Only Tutorial Resources

Run this only for the new bucket and additional key created in this tutorial. Keep every original
key, existing bucket, and application object. Do not use `--purge` or a bucket-wide empty command.

```bash
zcp object-storage object delete "$storage" "$bucket_name" sse-s3.txt -y
zcp object-storage object delete "$storage" "$bucket_name" sse-kms.txt -y
zcp object-storage object list "$storage" "$bucket_name"
zcp object-storage object versions "$storage" "$bucket_name"
```

Confirm both lists contain no objects, versions, or delete markers, then delete the empty bucket:

```bash
zcp object-storage bucket delete "$storage" "$bucket_slug"
zcp object-storage keys delete "$storage" "$temporary_key_id" -y
zcp object-storage keys list "$storage"
rm -- "$work_dir/payload.txt" "$work_dir/sse-s3.txt" "$work_dir/sse-kms.txt"
rmdir -- "$work_dir"
unset ZCP_S3_ACCESS_KEY ZCP_S3_SECRET_KEY AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
```

Confirm the additional key is revoked and the original active key remains. Close the shell session.

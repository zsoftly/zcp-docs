---
title: CLI & Advanced Features
sidebar_position: 4
---

The `zcp` CLI manages object storage end to end. Instance lifecycle (create, resize, delete,
credentials) and **bucket creation/listing** go through the ZSoftly control plane; everything at the
**bucket and object level** is performed directly against the S3 endpoint
(`https://objects.<region>.zcp.zsoftly.ca`) using your instance's access/secret keys, which the CLI
fetches for you.

The result: the CLI exposes the full S3 feature set of the platform — including many capabilities
**not available in the portal UI** (lifecycle rules, CORS, bucket policies, default encryption,
tagging, presigned URLs, server-side copy/move, object versioning workflows, and multipart cleanup).

Install and configure the CLI first — see [Installation](/public-cloud/cli/installation) and
[Configuration](/public-cloud/cli/configuration). The cloud provider for object storage is selected
automatically; you only choose a **region** and **project**.

## Where each feature is available

| Capability                                               | Portal UI | `zcp` CLI | S3 API / SDK |
| -------------------------------------------------------- | :-------: | :-------: | :----------: |
| Create / list / resize / delete instance                 |    ✅     |    ✅     |      —       |
| View S3 access key & secret                              |    ✅     |    ✅     |      —       |
| Auto-scaling toggle                                      |    ✅     |     —     |      —       |
| Create / list / delete bucket                            |    ✅     |    ✅     |      ✅      |
| Upload / download / delete objects                       |    ✅     |    ✅     |      ✅      |
| Folders (key prefixes)                                   |    ✅     |    ✅     |      ✅      |
| Make a bucket public                                     |    ✅     |    ✅     |      ✅      |
| Versioning enable / suspend / status                     |    ✅     |    ✅     |      ✅      |
| **Object Lock (WORM) at bucket creation**                |    ✅     | planned¹  |      ✅      |
| **List / download / delete / restore object _versions_** |     —     |    ✅     |      ✅      |
| **Presigned download URL** (`object url`)                |     —     |    ✅     |      ✅      |
| **Presigned upload URL** (`object put-url`)              |     —     |    ✅     |      ✅      |
| **Server-side copy / move**                              |     —     |    ✅     |      ✅      |
| **Object stat** (HEAD: size, type, ETag, user metadata)  |     —     |    ✅     |      ✅      |
| **Content-type & user metadata on upload**               |     —     |    ✅     |      ✅      |
| **Bucket & object tagging**                              |     —     |    ✅     |      ✅      |
| **Default encryption (SSE-S3)**                          |     —     |    ✅     |      ✅      |
| **Raw bucket policy** (get/set/delete)                   |     —     |    ✅     |      ✅      |
| **Lifecycle / expiration rules**                         |     —     |    ✅     |      ✅      |
| **CORS rules**                                           |     —     |    ✅     |      ✅      |
| **Incomplete multipart upload cleanup**                  |     —     |    ✅     |      ✅      |
| **Empty bucket / purge all versions**                    |     —     |    ✅     |      ✅      |

¹ Object Lock can only be enabled when a bucket is created. The portal supports this today; CLI
support is planned (see the note at the end of this page). You can also enable it directly against
the S3 endpoint with an SDK at bucket creation.

Anything marked **CLI / S3 API only** is also available through any S3-compatible SDK — see
[S3 API Usage](/public-cloud/storage/object-storage/s3-usage) for language examples.

## Command reference

`<storage>` is the object-storage instance slug, `<bucket>` a bucket slug, `<key>` an object key.
Add `-o json` (or `-o yaml`) to any command for machine-readable output, and `-y` to skip
confirmation prompts.

### Instance

```bash
zcp object-storage list                       # list instances
zcp object-storage get <storage>              # details + S3 endpoint + keys
zcp object-storage credentials <storage>      # S3 access key + secret only
zcp object-storage resize <storage> --size 200
zcp object-storage delete <storage> -y

# Create — pick an object-storage region (os-yul / os-yow) and a plan slug
zcp plan object-storage                        # list plan slugs + sizes + prices
zcp object-storage create \
  --name my-store --project default \
  --region os-yow --billing-cycle hourly --plan o1100g
```

| Flag (`create`)      | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| `--name`             | Instance name (required)                                                       |
| `--region`           | Object-storage region: `os-yul` or `os-yow` (required)                         |
| `--billing-cycle`    | e.g. `hourly`, `monthly` (required)                                            |
| `--project`          | Project slug (or `ZCP_PROJECT`)                                                |
| `--plan`             | Plan slug from `zcp plan object-storage` (storage category is derived from it) |
| `--storage-gb`       | Custom size in GB (alternative to `--plan`; min 60)                            |
| `--storage-category` | Override the storage category (rarely needed)                                  |

### Bucket

```bash
zcp object-storage bucket list <storage>
zcp object-storage bucket get <storage> <bucket>
zcp object-storage bucket create <storage> --name my-bucket
zcp object-storage bucket empty <storage> <bucket> -y           # delete all objects + versions
zcp object-storage bucket delete <storage> <bucket> --purge -y  # --purge empties versions first

# Public / private (applies an S3 bucket policy)
zcp object-storage bucket set-acl <storage> <bucket> --acl public-read
zcp object-storage bucket set-acl <storage> <bucket> --acl private

# Versioning
zcp object-storage bucket versioning enable  <storage> <bucket>
zcp object-storage bucket versioning suspend <storage> <bucket>
zcp object-storage bucket versioning status  <storage> <bucket>

# Raw S3 bucket policy (fine-grained access)
zcp object-storage bucket policy get    <storage> <bucket>            # -o yaml supported
zcp object-storage bucket policy set    <storage> <bucket> --file policy.json
zcp object-storage bucket policy delete <storage> <bucket>

# Tags
zcp object-storage bucket tag set    <storage> <bucket> --tag env=prod --tag team=data
zcp object-storage bucket tag get    <storage> <bucket>
zcp object-storage bucket tag delete <storage> <bucket>

# Default encryption (SSE-S3)
zcp object-storage bucket encryption enable  <storage> <bucket>
zcp object-storage bucket encryption status  <storage> <bucket>
zcp object-storage bucket encryption disable <storage> <bucket>

# Lifecycle (auto-expire)
zcp object-storage bucket lifecycle expire <storage> <bucket> --days 30 [--prefix logs/]
zcp object-storage bucket lifecycle expire <storage> <bucket> --noncurrent-days 7 --abort-multipart-days 3
zcp object-storage bucket lifecycle get    <storage> <bucket>          # -o yaml supported
zcp object-storage bucket lifecycle delete <storage> <bucket>

# CORS (browser apps)
zcp object-storage bucket cors set    <storage> <bucket> --origin '*' --method GET --method PUT --max-age 3600
zcp object-storage bucket cors get    <storage> <bucket>
zcp object-storage bucket cors delete <storage> <bucket>

# Incomplete multipart uploads (storage held by failed large uploads)
zcp object-storage bucket uploads list  <storage> <bucket>
zcp object-storage bucket uploads abort <storage> <bucket> <key>
```

`set-acl` values: `private`, `public-read`, `public-read-write`. Lifecycle accepts `--days` (current
versions), `--noncurrent-days` (old versions), and `--abort-multipart-days`; combine with `--prefix`
to scope to a key prefix.

### Object

```bash
zcp object-storage object list  <storage> <bucket>
zcp object-storage object stat  <storage> <bucket> <key>          # size, content-type, ETag, metadata
zcp object-storage object put   <storage> <bucket> ./file.bin --key data/file.bin \
    --content-type application/octet-stream --metadata owner=alice
zcp object-storage object download <storage> <bucket> <key> --dest ./file.bin
zcp object-storage object delete   <storage> <bucket> <key> -y

# Shareable URLs (no credentials needed by the recipient)
zcp object-storage object url     <storage> <bucket> <key> --expires 24h   # download link
zcp object-storage object put-url <storage> <bucket> <key> --expires 30m   # upload link (curl -T)

# Server-side copy / move (no download/upload round-trip)
zcp object-storage object copy <storage> <src-bucket> <src-key> <dst-bucket> <dst-key>
zcp object-storage object move <storage> <src-bucket> <src-key> <dst-bucket> <dst-key>

# Tags
zcp object-storage object tag set <storage> <bucket> <key> --tag kind=report

# Versioning workflows (require: bucket versioning enable)
zcp object-storage object versions <storage> <bucket> [--prefix p/]        # list versions + delete markers
zcp object-storage object download <storage> <bucket> <key> --version-id <id>
zcp object-storage object delete   <storage> <bucket> <key> --version-id <id>
zcp object-storage object restore  <storage> <bucket> <key>                # undelete (remove latest delete marker)
```

| Flag             | Commands                     | Description                                            |
| ---------------- | ---------------------------- | ------------------------------------------------------ |
| `--key`          | `put`                        | Remote object key (defaults to the local filename)     |
| `--content-type` | `put`                        | Content-Type (auto-detected from extension if omitted) |
| `--metadata k=v` | `put`                        | User metadata (`x-amz-meta-*`), repeatable             |
| `--dest`         | `download`                   | Local file or directory                                |
| `--version-id`   | `download`, `delete`, `stat` | Target a specific object version                       |
| `--expires`      | `url`, `put-url`             | Link lifetime (e.g. `30m`, `24h`; max `168h`/7 days)   |
| `--prefix`       | `versions`                   | Restrict to a key prefix                               |

:::tip

Presigned URLs (`object url` / `object put-url`) let you hand a single object to someone without
sharing credentials or making the whole bucket public — the link works until it expires (max 7
days), even on a private bucket.

:::

## Not yet in the CLI

- **Object Lock (WORM)** — enable it when creating a bucket in the portal, or directly against the
  S3 endpoint with an SDK. CLI support is planned.
- **Auto-scaling** the instance — use the portal.

Everything else listed in the matrix above is fully supported in `zcp` today.

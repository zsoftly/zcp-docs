---
title: Storage
description: Choose block or S3-compatible object storage for ZCP workloads.
---

ZCP provides block storage for virtual machines and S3-compatible object storage for data accessed
through buckets and an API. Choose the storage type based on how your application reads and writes
data.

## Choose a Storage Type

- **Block storage**: attach a volume to a virtual machine when an application needs a mounted disk.
  Use it for filesystems, databases, and application data that run on an instance.
- **Object storage**: store data in buckets when an application accesses objects through an
  S3-compatible API. Use it for uploads, backups, media, and shared application data.

Read [Storage Types and Resilience](/public-cloud/storage/block-storage/storage-types) before you
choose a block-storage tier.

## Protect Your Data

Plan snapshots and backups for data that needs recovery. A storage tier does not replace a backup
plan. Review the recovery needs of each workload before you deploy it.

## Next Steps

- [Create a block volume](/public-cloud/storage/block-storage/create-volume)
- [Create an object-storage bucket](/public-cloud/storage/object-storage/create-bucket)
- [Create a volume snapshot](/public-cloud/storage/block-storage/snapshots)
- [Manage object-storage access keys](/public-cloud/storage/object-storage/access-keys)

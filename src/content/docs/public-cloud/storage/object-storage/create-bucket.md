---
title: Create Bucket
sidebar_position: 1
---

## Object Storage (Object Store)

ZSoftly Public Cloud object storage is S3-compatible. Use it for files, backups, static assets, or
any unstructured data.

### Create an Object Storage Instance

- From the left-hand menu, click **Object Storage**.
- Click **Create Object Storage** or the **+** icon.

### Steps

1. **Assign to a Project**.
2. **Choose a Location**.
3. **Object Storage Size**: choose storage type and size. Custom plans available.
4. **Name**: provide a unique name.
5. **Create**:
   - Billing cycles: Hourly, Monthly, or Yearly.
   - Click **Review and Create**.

![Create Object Storage instance: project, location, size, name, and billing](../../../../../assets/storage/object-storage/create-bucket-steps.webp)

### Create a Bucket

Once your object storage instance is active:

- Click **Create Bucket**.
- Enter a **Bucket Name**.
- Optionally enable **Bucket Versioning** (required for Object Locking).
- Optionally enable **Object Locking**: stores objects in a write-once-read-many (WORM) model.

:::note

Object Locking only works in versioned buckets. Object versions count toward your total storage
costs.

:::

- Click **Create**.

![Create Bucket dialog with name, versioning, and object locking options](../../../../../assets/storage/object-storage/create-bucket-create-a-bucket.webp)

:::caution

The bucket you get is not named exactly what you typed. The platform appends a numeric suffix, so a
bucket requested as `app-backups` is created as something like `app-backups-001024`. That suffixed
value is the real S3 bucket name your tools must use. Read it back before you configure anything:

```bash
zcp object-storage bucket list <storage-slug> --region os-yul --project <project-slug>
```

```
SLUG                 NAME                 OBJECTS  SIZE (GB)  STATUS
app-backups-001024   app-backups-001024   0                   Inactive
```

Use the **NAME** column in endpoint URLs, SDK calls, and `aws s3` commands. A bucket showing
`Inactive` with zero objects is normal until something is written to it. See
[S3 API Usage](/public-cloud/storage/object-storage/s3-usage/#find-your-bucket-name).

:::

### Manage Buckets

- **Share**: Enable public sharing so anyone with the object URL can access it.
- **Upload Files**: Upload files directly through the portal.
- **Create Folder**: Organize objects into folders within the bucket.

![Bucket management view with Share, Upload Files, and Create Folder actions](../../../../../assets/storage/object-storage/create-bucket-manage-buckets.webp)

### Auto Scaling

Toggle auto-scaling on/off from the storage instance actions to automatically resize based on usage.

:::note

Screenshots coming.

:::

### Credentials

Click the **Credentials** icon to view your **S3 Access Key** and **Secret Key** for programmatic
access.

See also: [Access Keys](/public-cloud/storage/object-storage/access-keys),
[S3 Usage](/public-cloud/storage/object-storage/s3-usage/)

:::tip

This is ZSoftly Public Cloud's **managed, multi-tenant** object storage. Need a **dedicated,
single-tenant storage cluster with root access** you administer yourself? See
[ZSoftly Cloud Storage](/cloud-storage/overview).

:::

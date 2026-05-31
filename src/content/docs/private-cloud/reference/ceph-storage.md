---
title: Ceph Storage
sidebar_position: 2
---

# Ceph Storage Reference

Ceph provides both block storage (RBD) and object storage (RGW) for your private cloud.

## Version

Your credentials document specifies the Ceph version deployed in your environment.

## Official documentation

| Resource                  | URL                                            |
| ------------------------- | ---------------------------------------------- |
| Ceph Documentation        | https://docs.ceph.com                          |
| Ceph RBD (Block Storage)  | https://docs.ceph.com/en/latest/rbd/           |
| Ceph RGW (Object Storage) | https://docs.ceph.com/en/latest/radosgw/       |
| Ceph Dashboard            | https://docs.ceph.com/en/latest/mgr/dashboard/ |

## Object storage access

Your private cloud's Ceph RGW provides an S3-compatible object storage endpoint. Your credentials
document includes:

- **S3 Endpoint URL**
- **Access Key ID**
- **Secret Access Key**

Use any S3-compatible client (AWS CLI, boto3, rclone) with these credentials. Point the endpoint URL
to your private cloud's RGW address.

```bash
aws s3 ls --endpoint-url http://<rgw-endpoint> --profile your-profile
```

## Ceph Dashboard

The Ceph Dashboard is accessible at the URL in your credentials document. It provides:

- Cluster health and status
- Pool and OSD management
- RGW user and bucket management

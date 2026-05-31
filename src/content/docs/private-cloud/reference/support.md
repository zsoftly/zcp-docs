---
title: Support
sidebar_position: 4
---

# Private Cloud Support

## Contact ZSoftly Support

For private cloud support, use the contact information provided in your handover document.

**Support portal:** https://cloud.zcp.zsoftly.ca (raise a ticket under your private cloud account)

## What ZSoftly covers

- Initial deployment issues (anything not working at handover)
- Infrastructure-layer problems (host failures, storage issues, network outages)
- CloudStack upgrades and patching (as agreed in your contract)
- VPN access issues
- Capacity expansion (adding hosts, storage)

## What you manage

- VM provisioning and management
- Application-level configuration within your VMs
- User and account management in CloudStack
- Bucket and object management in Ceph RGW
- Kubernetes workloads (if deployed)

## Before contacting support

1. Check the CloudStack UI for alerts or error messages
2. Review `sudo wg show` if the issue is VPN-related
3. Check Ceph Dashboard health if the issue is storage-related
4. Have your **zone name** and **CloudStack version** ready

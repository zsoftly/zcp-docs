---
title: CLI Reference
sidebar_position: 4
---

## CLI Reference

Full command reference for the ZCP CLI v0.0.9.

For the interactive reference with search, see the
[ZCP CLI reference on the main site](https://cloud.zcp.zsoftly.ca).

---

### Core

| Command                  | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| `zcp version`            | Print CLI version                                        |
| `zcp completion <shell>` | Generate shell completions (bash\|zsh\|fish\|powershell) |
| `zcp auth validate`      | Validate authentication token                            |

### Profile Management

| Command                          | Description                  |
| -------------------------------- | ---------------------------- |
| `zcp profile add`                | Add a new credential profile |
| `zcp profile list`               | List all profiles            |
| `zcp profile show`               | Show the active profile      |
| `zcp profile use <name>`         | Switch to a profile          |
| `zcp profile update`             | Update profile fields        |
| `zcp profile delete <name>`      | Delete a profile             |
| `zcp profile rename <old> <new>` | Rename a profile             |

### Compute: Instances

| Command                       | Description              |
| ----------------------------- | ------------------------ |
| `zcp instance list`           | List instances           |
| `zcp instance get <name>`     | Get instance details     |
| `zcp instance create`         | Create a new instance    |
| `zcp instance delete <name>`  | Delete an instance       |
| `zcp instance start <name>`   | Start a stopped instance |
| `zcp instance stop <name>`    | Power off an instance    |
| `zcp instance reboot <name>`  | Reboot an instance       |
| `zcp instance console <name>` | Get console URL          |

### Compute: Kubernetes

| Command                         | Description                |
| ------------------------------- | -------------------------- |
| `zcp kubernetes list`           | List clusters              |
| `zcp kubernetes create`         | Create a cluster           |
| `zcp kubernetes start <name>`   | Start a stopped cluster    |
| `zcp kubernetes stop <name>`    | Stop a cluster             |
| `zcp kubernetes upgrade <name>` | Upgrade Kubernetes version |

### Storage: Volumes

| Command                    | Description                |
| -------------------------- | -------------------------- |
| `zcp volume list`          | List block storage volumes |
| `zcp volume create`        | Create a new volume        |
| `zcp volume delete <name>` | Delete a volume            |

### Storage: Snapshots

| Command                | Description           |
| ---------------------- | --------------------- |
| `zcp snapshot list`    | List volume snapshots |
| `zcp vm-snapshot list` | List VM snapshots     |

### Storage: Object Storage

| Command                            | Description                   |
| ---------------------------------- | ----------------------------- |
| `zcp object-storage list`          | List object storage instances |
| `zcp object-storage create`        | Create object storage         |
| `zcp object-storage delete <name>` | Delete object storage         |

### Networking: VPC

| Command                 | Description  |
| ----------------------- | ------------ |
| `zcp vpc list`          | List VPCs    |
| `zcp vpc create`        | Create a VPC |
| `zcp vpc delete <name>` | Delete a VPC |

### Networking: Networks

| Command              | Description      |
| -------------------- | ---------------- |
| `zcp network list`   | List networks    |
| `zcp network create` | Create a network |

### Networking: Firewall

| Command                    | Description            |
| -------------------------- | ---------------------- |
| `zcp firewall list`        | List firewall rules    |
| `zcp firewall create`      | Create a firewall rule |
| `zcp firewall delete <id>` | Delete a firewall rule |

### Networking: Load Balancer

| Command                   | Description            |
| ------------------------- | ---------------------- |
| `zcp loadbalancer list`   | List load balancers    |
| `zcp loadbalancer create` | Create a load balancer |

### Networking: DNS

| Command                   | Description      |
| ------------------------- | ---------------- |
| `zcp dns list`            | List DNS domains |
| `zcp dns create`          | Add a domain     |
| `zcp dns delete <domain>` | Remove a domain  |

### Networking: IP Addresses

| Command               | Description              |
| --------------------- | ------------------------ |
| `zcp ip list`         | List public IP addresses |
| `zcp ip acquire`      | Acquire a new public IP  |
| `zcp ip release <id>` | Release a public IP      |

### Account

| Command              | Description          |
| -------------------- | -------------------- |
| `zcp project list`   | List projects        |
| `zcp project create` | Create a project     |
| `zcp billing list`   | View billing summary |
| `zcp support list`   | List support tickets |

For the full 200+ command listing, see the [GitHub repository](https://github.com/zsoftly/zcp-cli).

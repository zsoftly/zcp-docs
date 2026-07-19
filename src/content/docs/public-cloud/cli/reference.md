---
title: CLI Reference
sidebar_position: 4
---

Full command reference for the ZCP CLI v0.0.19.

For the interactive reference with search, see the
[ZCP CLI reference on the main site](https://cloud.zcp.zsoftly.ca).

:::note

Almost every command requires a **region** and **project** (resources and the catalog are
region/project-specific). Set them once with `zcp profile add` (it captures a default region and
project, like `aws configure`), or pass `--region`/`--project` / set `ZCP_REGION`/`ZCP_PROJECT`. The
examples below assume a configured default. Account-level commands (`dns`, `auth`, `profile`,
`region`, `project`, `cloud-provider`, `currency`, `billing-cycle`, `server`,
billing/support/dashboard, and the IAM commands `sub-user`/`role`/`permission`) are exempt. See
[Configuration](/public-cloud/cli/configuration).

:::

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

Account-level. No `--region`/`--project` needed, except `zcp dns create` takes `--project`. See
[Manage DNS with the CLI](/public-cloud/dns/cli).

| Command                   | Description                             |
| ------------------------- | --------------------------------------- |
| `zcp dns list`            | List DNS domains                        |
| `zcp dns create`          | Add a domain                            |
| `zcp dns show <domain>`   | Show a domain and its records           |
| `zcp dns record-create`   | Add a record by name, type, and content |
| `zcp dns record-delete`   | Delete a record set by name and type    |
| `zcp dns delete <domain>` | Remove a domain                         |

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

### Identity & Access (IAM)

Account-level. No `--region`/`--project` needed. See [Roles & Permissions](/public-cloud/iam/roles)
and [Users](/public-cloud/iam/users) for the model and the full permission catalog.

| Command                            | Description                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `zcp permission list`              | List the permission catalog (use `--category` to filter)                     |
| `zcp role list`                    | List roles                                                                   |
| `zcp role get <slug>`              | Show a role with its permissions and assigned users                          |
| `zcp role create`                  | Create a role (`--name`, repeatable `--permission <slug>`)                   |
| `zcp role update <slug>`           | Update a role (`--permission` **replaces** the set)                          |
| `zcp role delete <slug>`           | Delete a role                                                                |
| `zcp sub-user list`                | List sub-users (`--role`, `--blocked` filters)                               |
| `zcp sub-user create`              | Create a sub-user (`--name`, `--email`, `--password`, `--role`, `--project`) |
| `zcp sub-user update <id\|email>`  | Update a sub-user's name, email, role, or projects                           |
| `zcp sub-user block <id\|email>`   | Block a sub-user (revoke access without deleting)                            |
| `zcp sub-user unblock <id\|email>` | Unblock a sub-user                                                           |
| `zcp sub-user delete <id\|email>`  | Delete a sub-user                                                            |

For the full 200+ command listing, see the [GitHub repository](https://github.com/zsoftly/zcp-cli).

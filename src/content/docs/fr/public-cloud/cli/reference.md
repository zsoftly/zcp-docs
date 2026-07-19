---
title: Référence CLI
sidebar_position: 4
---

Référence complète des commandes de la CLI ZCP v0.0.19.

Pour la référence interactive avec recherche, consultez la
[référence de la CLI ZCP sur le site principal](https://cloud.zcp.zsoftly.ca).

:::note

Presque toutes les commandes exigent une **région** et un **projet** (les ressources et le catalogue
sont propres à une région/un projet). Définissez-les une fois avec `zcp profile add` (qui enregistre
une région et un projet par défaut, comme `aws configure`), ou passez `--region`/`--project` / les
variables `ZCP_REGION`/`ZCP_PROJECT`. Les exemples ci-dessous supposent une valeur par défaut
configurée. Les commandes de niveau compte (`dns`, `auth`, `profile`, `region`, `project`,
`cloud-provider`, `currency`, `billing-cycle`, `server`, `billing`/`support`/`dashboard`, ainsi que
les commandes IAM `sub-user`/`role`/`permission`) sont exemptées. Voir
[Configuration](/fr/public-cloud/cli/configuration).

:::

---

### Commandes de base

| Commande                 | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| `zcp version`            | Afficher la version de la CLI                               |
| `zcp completion <shell>` | Générer les complétions shell (bash\|zsh\|fish\|powershell) |
| `zcp auth validate`      | Valider le jeton d'authentification                         |

### Gestion des profils

| Commande                         | Description                              |
| -------------------------------- | ---------------------------------------- |
| `zcp profile add`                | Ajouter un nouveau profil d'identifiants |
| `zcp profile list`               | Lister tous les profils                  |
| `zcp profile show`               | Afficher le profil actif                 |
| `zcp profile use <name>`         | Passer à un profil                       |
| `zcp profile update`             | Mettre à jour les champs d'un profil     |
| `zcp profile delete <name>`      | Supprimer un profil                      |
| `zcp profile rename <old> <new>` | Renommer un profil                       |

### Calcul : instances

| Commande                      | Description                        |
| ----------------------------- | ---------------------------------- |
| `zcp instance list`           | Lister les instances               |
| `zcp instance get <name>`     | Obtenir les détails d'une instance |
| `zcp instance create`         | Créer une instance                 |
| `zcp instance delete <name>`  | Supprimer une instance             |
| `zcp instance start <name>`   | Démarrer une instance arrêtée      |
| `zcp instance stop <name>`    | Éteindre une instance              |
| `zcp instance reboot <name>`  | Redémarrer une instance            |
| `zcp instance console <name>` | Obtenir l'URL de console           |

### Calcul : Kubernetes

| Commande                        | Description                           |
| ------------------------------- | ------------------------------------- |
| `zcp kubernetes list`           | Lister les clusters                   |
| `zcp kubernetes create`         | Créer un cluster                      |
| `zcp kubernetes start <name>`   | Démarrer un cluster arrêté            |
| `zcp kubernetes stop <name>`    | Arrêter un cluster                    |
| `zcp kubernetes upgrade <name>` | Mettre à niveau la version Kubernetes |

### Stockage : volumes

| Commande                   | Description                         |
| -------------------------- | ----------------------------------- |
| `zcp volume list`          | Lister les volumes de stockage bloc |
| `zcp volume create`        | Créer un volume                     |
| `zcp volume delete <name>` | Supprimer un volume                 |

### Stockage : instantanés

| Commande               | Description                      |
| ---------------------- | -------------------------------- |
| `zcp snapshot list`    | Lister les instantanés de volume |
| `zcp vm-snapshot list` | Lister les instantanés de VM     |

### Stockage : stockage objet

| Commande                           | Description                              |
| ---------------------------------- | ---------------------------------------- |
| `zcp object-storage list`          | Lister les instances de stockage objet   |
| `zcp object-storage create`        | Créer une instance de stockage objet     |
| `zcp object-storage delete <name>` | Supprimer une instance de stockage objet |

### Réseau : VPC

| Commande                | Description      |
| ----------------------- | ---------------- |
| `zcp vpc list`          | Lister les VPC   |
| `zcp vpc create`        | Créer un VPC     |
| `zcp vpc delete <name>` | Supprimer un VPC |

### Réseau : réseaux

| Commande             | Description        |
| -------------------- | ------------------ |
| `zcp network list`   | Lister les réseaux |
| `zcp network create` | Créer un réseau    |

### Réseau : pare-feu

| Commande                   | Description                     |
| -------------------------- | ------------------------------- |
| `zcp firewall list`        | Lister les règles de pare-feu   |
| `zcp firewall create`      | Créer une règle de pare-feu     |
| `zcp firewall delete <id>` | Supprimer une règle de pare-feu |

### Réseau : équilibreur de charge

| Commande                  | Description                       |
| ------------------------- | --------------------------------- |
| `zcp loadbalancer list`   | Lister les équilibreurs de charge |
| `zcp loadbalancer create` | Créer un équilibreur de charge    |

### Réseau : DNS

De niveau compte. Aucun `--region`/`--project` requis, sauf pour `zcp dns create`, qui reçoit
`--project`. Voir [Gérer le DNS avec le CLI](/fr/public-cloud/dns/cli).

| Commande                  | Description                                        |
| ------------------------- | -------------------------------------------------- |
| `zcp dns list`            | Lister les domaines DNS                            |
| `zcp dns create`          | Ajouter un domaine                                 |
| `zcp dns show <domain>`   | Afficher un domaine et ses enregistrements         |
| `zcp dns record-create`   | Ajouter un enregistrement par nom, type et contenu |
| `zcp dns record-delete`   | Supprimer un ensemble par nom et type              |
| `zcp dns delete <domain>` | Retirer un domaine                                 |

### Réseau : adresses IP

| Commande              | Description                       |
| --------------------- | --------------------------------- |
| `zcp ip list`         | Lister les adresses IP publiques  |
| `zcp ip acquire`      | Acquérir une nouvelle IP publique |
| `zcp ip release <id>` | Libérer une IP publique           |

### Compte

| Commande             | Description                         |
| -------------------- | ----------------------------------- |
| `zcp project list`   | Lister les projets                  |
| `zcp project create` | Créer un projet                     |
| `zcp billing list`   | Afficher le sommaire de facturation |
| `zcp support list`   | Lister les billets de soutien       |

### Identité et accès (IAM)

De niveau compte. Aucun `--region`/`--project` requis. Voir
[Rôles et permissions](/fr/public-cloud/iam/roles) et [Utilisateurs](/fr/public-cloud/iam/users)
pour le modèle et le catalogue complet des permissions.

| Commande                           | Description                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| `zcp permission list`              | Lister le catalogue des permissions (filtrer avec `--category`)                      |
| `zcp role list`                    | Lister les rôles                                                                     |
| `zcp role get <slug>`              | Afficher un rôle avec ses permissions et ses utilisateurs                            |
| `zcp role create`                  | Créer un rôle (`--name`, `--permission <slug>` répétable)                            |
| `zcp role update <slug>`           | Modifier un rôle (`--permission` **remplace** l'ensemble)                            |
| `zcp role delete <slug>`           | Supprimer un rôle                                                                    |
| `zcp sub-user list`                | Lister les sous-utilisateurs (filtres `--role`, `--blocked`)                         |
| `zcp sub-user create`              | Créer un sous-utilisateur (`--name`, `--email`, `--password`, `--role`, `--project`) |
| `zcp sub-user update <id\|email>`  | Modifier le nom, le courriel, le rôle ou les projets                                 |
| `zcp sub-user block <id\|email>`   | Bloquer un sous-utilisateur (révoquer l'accès sans le supprimer)                     |
| `zcp sub-user unblock <id\|email>` | Débloquer un sous-utilisateur                                                        |
| `zcp sub-user delete <id\|email>`  | Supprimer un sous-utilisateur                                                        |

Pour la liste complète de plus de 200 commandes, consultez le
[dépôt GitHub](https://github.com/zsoftly/zcp-cli).

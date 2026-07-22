---
title: Neo4j
---

Neo4j est une base de données graphe native qui stocke les données sous forme de nœuds et de
relations plutôt que de lignes et de tables. Elle utilise le langage de requête Cypher pour
parcourir efficacement les données fortement connectées, ce qui convient bien aux moteurs de
recommandation, à la détection de fraudes, aux graphes de connaissances et à l'analyse de réseaux.
Le navigateur HTTP fonctionne sur le port 7474 et le protocole Bolt sur le port 7687.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Neo4j     | 2026.06.0 |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable         | Description        |
| ---------------- | ------------------ |
| `NEO4J_PASSWORD` | Mot de passe Neo4j |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Neo4j génère un mot de passe initial unique, configure son adresse annoncée et démarre le service
systemd natif. Cette opération prend environ deux à trois minutes. Suivez la progression avec :

```bash
sudo journalctl -u neo4j-first-boot.service -f
```

Vérifiez ensuite le service :

```bash
systemctl status neo4j
```

### 3. Accéder au navigateur Neo4j

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:7474
```

Consultez les informations de connexion générées :

```bash
sudo cat /root/.credentials/neo4j.txt
```

| Champ             | Valeur                              |
| ----------------- | ----------------------------------- |
| Nom d'utilisateur | `neo4j`                             |
| Mot de passe      | Dans `/root/.credentials/neo4j.txt` |

Vous serez invité à définir un nouveau mot de passe lors de la première connexion. Les applications
se connectent par Bolt à `bolt://<your-vm-ip>:7687`.

## Gérer Neo4j

```bash
# Check service status
systemctl status neo4j

# Restart Neo4j
sudo systemctl restart neo4j

# View logs
sudo journalctl -u neo4j -f
```

| Chemin                         | Fonction                      |
| ------------------------------ | ----------------------------- |
| `/etc/neo4j/neo4j.conf`        | Configuration principale      |
| `/var/lib/neo4j/data/`         | Bases de données et graphes   |
| `/var/log/neo4j/`              | Journaux Neo4j                |
| `/root/.credentials/neo4j.txt` | Identifiants initiaux générés |

## Sécurité

Les ports 7474 et 7687 sont ouverts sur l'interface réseau de la VM. UFW est activé et autorise le
navigateur (port 7474), Bolt (port 7687) et SSH (port 22).

**Pour limiter les deux points de terminaison à une adresse IP précise :**

```bash
sudo ufw delete allow 7474/tcp
sudo ufw delete allow 7687/tcp
sudo ufw allow from <trusted-ip> to any port 7474
sudo ufw allow from <trusted-ip> to any port 7687
```

**Pour accéder à Neo4j sans laisser ces ports ouverts, utilisez un tunnel SSH :**

Fermez d'abord le port public sur la VM, puisqu'il est ouvert par défaut :

```bash
sudo ufw delete allow 7474/tcp
sudo ufw delete allow 7687/tcp
```

```bash
# Run this on your local machine
ssh -L 7474:localhost:7474 -L 7687:localhost:7687 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:7474
```

**Pour une utilisation en production**, limitez Neo4j aux réseaux privés d'applications et
d'administrateurs. Placez le navigateur derrière un proxy inverse TLS et configurez des connexions
Bolt chiffrées avant de transmettre des identifiants ou des données de graphe sur un réseau non
fiable.

:::caution

Modifiez le mot de passe initial généré lorsque Neo4j vous le demande à la première connexion.
N'exposez pas largement le navigateur ou les points de terminaison Bolt à Internet.

:::

## Étapes suivantes

- [Documentation de Neo4j](https://neo4j.com/docs/)
- [Guide d'installation de Neo4j](https://neo4j.com/docs/operations-manual/current/docker/docker-compose-standalone/)

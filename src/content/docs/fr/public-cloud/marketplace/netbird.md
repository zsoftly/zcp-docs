---
title: NetBird
---

NetBird est un réseau superposé libre basé sur WireGuard qui connecte serveurs et appareils dans un
réseau privé pair à pair. Il ne nécessite pas l'ouverture de ports entrants ni la configuration de
règles de pare-feu. Toutes les connexions sont initiées vers l'extérieur. Cette image fournit le
client NetBird préinstallé, prêt à joindre votre réseau.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| NetBird   | 0.71.4    |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Vous pouvez éventuellement fournir une clé de configuration NetBird lors du déploiement depuis la
marketplace. Si elle est définie, la VM rejoint automatiquement votre réseau NetBird au premier
démarrage ; sinon, connectez-vous manuellement avec `netbird up` après le déploiement.

| Variable       | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| `NB_SETUP_KEY` | Clé de configuration NetBird pour rejoindre votre réseau au démarrage. |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Joignez votre réseau NetBird

Vous aurez besoin d'une clé de configuration provenant de votre console de gestion NetBird. Les clés
de configuration sont créées sous **Setup Keys** dans le tableau de bord NetBird.

**Avec NetBird Cloud (app.netbird.io):**

```bash
sudo netbird up --setup-key <your-setup-key>
```

**Avec un serveur de gestion auto-hébergé:**

```bash
sudo netbird up \
  --management-url https://<your-management-server> \
  --setup-key <your-setup-key>
```

### 3. Vérifiez la connexion

```bash
netbird status
```

La VM devrait apparaître avec son adresse IP NetBird. Les autres pairs du même réseau apparaîtront
dans la sortie d'état.

## Gérer NetBird

```bash
# Vérifier l'état de la connexion
netbird status

# Déconnecter
sudo netbird down

# Reconnecter
sudo netbird up

# Consulter les journaux
sudo journalctl -u netbird -f
```

## Sécurité

NetBird utilise WireGuard pour établir des tunnels pair à pair chiffrés. Tout le trafic entre pairs
est chiffré de bout en bout. UFW est activé et n'autorise que SSH (port 22). Aucun port
supplémentaire ne doit être ouvert pour le trafic NetBird.

Le contrôle d'accès entre pairs est géré au moyen de politiques dans la console de gestion NetBird.

## Prochaines étapes

- [Documentation NetBird](https://docs.netbird.io/)
- [Guide des clés de configuration](https://docs.netbird.io/how-to/setup-keys)
- [Politiques de contrôle d'accès](https://docs.netbird.io/how-to/manage-network-access)

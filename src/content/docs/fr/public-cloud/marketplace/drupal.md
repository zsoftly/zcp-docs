---
title: Drupal
---

Drupal est un système de gestion de contenu open source pour les sites et applications riches en
contenu. Son modèle d'entités, sa taxonomie et son écosystème de modules permettent aux équipes de
créer des types de contenu personnalisés, des flux éditoriaux et des sites multilingues sans écrire
elles-mêmes le code sous-jacent.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Drupal    | 11.4.1    |
| PHP       | 8.3       |
| Apache    | Dernière  |
| MariaDB   | Dernière  |
| Drush     | 13        |
| Ubuntu    | 24.04 LTS |

Drupal s'exécute sur une pile LAMP native (Apache, MariaDB, PHP). Le site est préinstallé avec le
profil **Standard**. Il est donc prêt à utiliser dès que la machine virtuelle démarre.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

Les besoins de stockage augmentent avec les téléversements de médias et le nombre de modules
installés.

## Démarrage

### 1. Se connecter à la machine virtuelle

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script crée la base de données, installe le site Drupal avec Drush, puis
génère les mots de passe administrateur et base de données. Cela prend 1 à 2 minutes. Suivez la
progression:

```bash
journalctl -u drupal-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Drupal est prêt.

### 3. Récupérer les identifiants administrateur

Le mot de passe administrateur, ainsi que les identifiants de base de données, sont écrits dans un
fichier réservé à root:

```bash
sudo cat /root/.credentials/drupal.txt
```

### 4. Se connecter à l'administration

Ouvrez le site dans un navigateur:

```text
http://<your-vm-ip>/
```

Connectez-vous depuis la page d'administration:

```text
http://<your-vm-ip>/user/login
```

| Champ             | Valeur                                 |
| ----------------- | -------------------------------------- |
| Nom d'utilisateur | `admin`                                |
| Mot de passe      | Depuis `/root/.credentials/drupal.txt` |

## Gérer Drupal

Drupal est servi par Apache avec MariaDB. Les deux services sont gérés par systemd.

```bash
# Etat des services
systemctl status apache2
systemctl status mariadb

# Redémarrer le serveur web
sudo systemctl restart apache2

# Exécuter des commandes Drush depuis la racine du projet
cd /var/www/drupal && vendor/bin/drush status
cd /var/www/drupal && vendor/bin/drush cache:rebuild
```

| Chemin                                           | Rôle                          |
| ------------------------------------------------ | ----------------------------- |
| `/var/www/drupal`                                | Racine du projet              |
| `/var/www/drupal/web`                            | Racine web                    |
| `/var/www/drupal/web/sites/default/settings.php` | Configuration du site         |
| `/var/www/drupal/web/sites/default/files`        | Fichiers et médias téléversés |

## Sécurité

Le port 80 est ouvert sur l'interface réseau de la machine virtuelle. UFW est activé et autorise SSH
(port 22) et HTTP (port 80). L'image sert uniquement HTTP en clair.

:::caution

Le site est livré avec `$settings['trusted_host_patterns']` configuré pour autoriser tout hôte
(`^.+$`). Avant de publier le site sur un domaine public, resserrez ce réglage dans
`/var/www/drupal/web/sites/default/settings.php` afin qu'il corresponde à votre nom d'hôte.

:::

**En production**, placez l'instance derrière un proxy inverse avec TLS (par exemple Nginx ou Caddy)
afin que le site soit servi en HTTPS, puis mettez à jour `trusted_host_patterns` en conséquence.

## Prochaines étapes

- [Documentation Drupal](https://www.drupal.org/docs)
- [Documentation Drush](https://www.drush.org/)

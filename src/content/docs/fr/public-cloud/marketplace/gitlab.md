---
title: GitLab CE 18.11
---

GitLab Community Edition est une plateforme DevOps complète fournie sous forme d'application unique.
Elle offre l'hébergement de dépôts Git, les pipelines CI/CD, le suivi des tickets, un registre de
conteneurs et plus encore. L'ensemble s'exécute sur votre propre infrastructure.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| GitLab CE | 18.11.x   |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Vous pouvez définir ces valeurs lors du déploiement de GitLab depuis la marketplace. Laissez un
champ vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable               | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `GITLAB_ROOT_PASSWORD` | Mot de passe initial du compte `root` de GitLab   |
| `GITLAB_EXTERNAL_URL`  | URL externe à partir de laquelle GitLab est servi |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il configure l'URL
externe et exécute `gitlab-ctl reconfigure` pour initialiser tous les services GitLab. Cela prend
**3 à 5 minutes**.

Suivez la progression:

```bash
journalctl -u gitlab-first-boot.service -f
```

Le MOTD affiché à la connexion confirmera que GitLab est prêt.

### 3. Récupérez le mot de passe initial de `root`

```bash
sudo cat /etc/gitlab/initial_root_password
```

:::caution

Ce fichier est supprimé automatiquement 24 heures après le premier démarrage. Connectez-vous et
changez le mot de passe `root` avant son expiration.

:::

### 4. Accédez à l'interface GitLab

Ouvrez un navigateur et accédez à l'adresse IP ou au nom d'hôte de votre VM:

```text
http://<your-vm-ip>
```

Connectez-vous avec:

| Champ             | Valeur                                     |
| ----------------- | ------------------------------------------ |
| Nom d'utilisateur | `root`                                     |
| Mot de passe      | Depuis `/etc/gitlab/initial_root_password` |

Changez votre mot de passe immédiatement après la première connexion.

## Facultatif : définir une URL externe personnalisée

Si GitLab doit être servi à partir d'un nom de domaine, fournissez l'URL au déploiement avec les
userdata cloud-init. Sans cette valeur, GitLab utilise `http://<hostname>` par défaut.

Ajoutez ceci aux userdata de votre VM au moment du déploiement:

```yaml
#cloud-config
write_files:
  - path: /run/gitlab-external-url
    content: 'https://gitlab.example.com'
    permissions: '0600'
    owner: root:root
```

Pour modifier l'URL après le déploiement, modifiez `/etc/gitlab/gitlab.rb`:

```ruby
external_url 'https://gitlab.example.com'
```

Exécutez ensuite:

```bash
sudo gitlab-ctl reconfigure
```

## Gérer GitLab

```bash
# Vérifier l'état de tous les services
sudo gitlab-ctl status

# Redémarrer tous les services
sudo gitlab-ctl restart

# Consulter les journaux (tous les services)
sudo gitlab-ctl tail

# Consulter les journaux d'un service précis
sudo gitlab-ctl tail nginx
sudo gitlab-ctl tail puma
```

Fichier de configuration: `/etc/gitlab/gitlab.rb`

Après avoir modifié `gitlab.rb`, exécutez toujours `sudo gitlab-ctl reconfigure` pour appliquer les
changements.

## Sécurité

Le port 80 est ouvert par défaut. UFW est activé.

**Pour activer HTTPS avec Let's Encrypt**, modifiez `/etc/gitlab/gitlab.rb`:

```ruby
external_url 'https://gitlab.example.com'
letsencrypt['enable'] = true
letsencrypt['contact_emails'] = ['admin@example.com']
```

Exécutez ensuite:

```bash
sudo gitlab-ctl reconfigure
```

:::tip

Limitez l'accès Git par SSH (port 22) à des plages d'adresses IP connues si votre instance GitLab
n'est pas destinée à être publique. Créez des comptes utilisateur individuels. Évitez de partager le
compte `root`.

:::

## Prochaines étapes

- [Documentation GitLab CE](https://docs.gitlab.com/ee/)
- [Guide d'administration GitLab](https://docs.gitlab.com/ee/administration/)
- [Référence des pipelines CI/CD](https://docs.gitlab.com/ee/ci/)

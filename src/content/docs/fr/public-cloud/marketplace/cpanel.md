---
title: cPanel
---

cPanel est le panneau de contrôle d'hébergement Web de référence dans l'industrie, utilisé par des
fournisseurs d'hébergement et des propriétaires de sites partout dans le monde. Il fournit une
interface graphique pour gérer les sites Web, les comptes courriel, les bases de données, le DNS, le
FTP et plus encore. WHM (Web Host Manager) est l'interface d'administration serveur qui chapeaute
cPanel.

## Logiciels inclus

| Composant    | Version                 |
| ------------ | ----------------------- |
| cPanel & WHM | Dernière version stable |
| Ubuntu       | 24.04 LTS               |

## Bien démarrer

### 1. Connectez-vous à WHM

Les licences cPanel sont basées sur l'adresse IP et sont activées lorsque vous accédez à WHM pour la
première fois depuis l'adresse IP publique de la VM. Ouvrez un navigateur et accédez à:

```text
https://<your-vm-ip>:2087
```

Connectez-vous avec:

| Champ             | Valeur                       |
| ----------------- | ---------------------------- |
| Nom d'utilisateur | `root`                       |
| Mot de passe      | Mot de passe `root` de la VM |

:::note

Si vous ne connaissez pas le mot de passe `root`, réinitialisez-le depuis le panneau de contrôle ZCP
sous **Instances → Réinitialiser le mot de passe**.

:::

### 2. Terminez l'assistant de configuration WHM

L'assistant de configuration WHM s'exécute lors de la première connexion. Il vous invitera à:

1. Accepter le contrat de licence
2. Entrer une adresse courriel de contact
3. Configurer les serveurs de noms
4. Configurer les adresses IP et le réseau
5. Choisir les ensembles par défaut

Terminez l'assistant avant de créer des comptes d'hébergement.

### 3. Créez votre premier compte cPanel

Dans WHM, allez à **Account Functions → Create a New Account** pour configurer un compte
d'hébergement. Chaque compte obtient sa propre interface cPanel accessible à:

```text
https://<your-vm-ip>:2083
```

## Référence des ports

| Interface            | Port     | Protocole |
| -------------------- | -------- | --------- |
| WHM (administration) | 2087     | HTTPS     |
| WHM (administration) | 2086     | HTTP      |
| cPanel (utilisateur) | 2083     | HTTPS     |
| cPanel (utilisateur) | 2082     | HTTP      |
| Webmail              | 2096     | HTTPS     |
| FTP                  | 21       | FTP       |
| HTTP                 | 80       | HTTP      |
| HTTPS                | 443      | HTTPS     |
| SSH                  | 22       | SSH       |
| SMTP                 | 25, 587  | SMTP      |
| IMAP                 | 143, 993 | IMAP      |
| POP3                 | 110, 995 | POP3      |

## Gérer cPanel et WHM

cPanel et WHM gèrent leurs propres services à l'interne. Utilisez WHM pour toutes les modifications
au niveau serveur. La suite de commandes `cpanel` est accessible depuis SSH:

```bash
# Vérifier l'état du service cPanel
sudo /usr/local/cpanel/scripts/check_cpanel_rpms --fix

# Redémarrer les services cPanel
sudo /scripts/restartsrv_cpsrvd

# Consulter le journal d'erreurs cPanel
sudo tail -f /usr/local/cpanel/logs/error_log
```

## Sécurité

cPanel gère son propre pare-feu (CSF/LFD) indépendamment d'UFW. UFW est désactivé pendant
l'installation afin de laisser cPanel gérer le pare-feu.

:::caution

Changez immédiatement le mot de passe `root` et configurez l'authentification à deux facteurs dans
WHM. Limitez l'accès à WHM à l'adresse IP de votre bureau si possible.

:::

## Prochaines étapes

- [Documentation cPanel](https://docs.cpanel.net/)
- [Guide d'administration WHM](https://docs.cpanel.net/whm/)
- [Conseiller de sécurité cPanel](https://docs.cpanel.net/whm/security-center/security-advisor/)

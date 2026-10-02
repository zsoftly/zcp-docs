---
title: 'Déployer des postes Ubuntu pour les employés sur ZCP'
description:
  Déployez un bureau distant Ubuntu KDE complet pour un employé dans votre niveau privé créé avec le
  tutoriel « Créer un réseau privé avec Headscale », accessible uniquement par le maillage via RDP
  avec le CLI zcp.
sidebar:
  label: 'Déployer des postes employés (CLI)'
---

Ce tutoriel déploie un bureau Ubuntu KDE complet pour un employé sur une VM du niveau privé créé
avec [Créer un réseau privé avec Headscale](/tutorials/build-private-network-headscale). Le bureau
est accessible uniquement par le maillage via RDP. RDP n'est jamais exposé publiquement.

À la fin, vous aurez :

- Une VM dans votre niveau privé existant exécutant un bureau Ubuntu KDE complet
- Une connexion nommée pour l'employé, provisionnée par cloud-init, et non le compte par défaut du
  modèle
- La confirmation que le bureau fonctionne de bout en bout avec RDP et que seule SSH est accessible
  sur son IP publique

Prévoyez environ 30 minutes pour le déploiement de l'image, le provisionnement KDE au premier
démarrage et l'activation de l'interface réseau du niveau.

## Avant de commencer

- Terminez [Créer un réseau privé avec Headscale](/tutorials/build-private-network-headscale) : vous
  avez besoin d'un VPC avec un niveau privé, d'un serveur Headscale et d'un routeur de sous-réseau
  qui annonce et sert déjà la route de ce niveau, par exemple `my-workspace-tier` si vous avez
  utilisé `--name my-workspace`. Ce tutoriel ne dépend pas du tutoriel de stockage.
- Gardez `ZCP_REGION` et `ZCP_PROJECT` exportés depuis un tutoriel précédent ou exportez-les de
  nouveau.
- Utilisez le même nom de clé SSH que dans l'étape 4 de ce tutoriel.
- Installez `jq`, `ssh` et `curl`. `curl` récupère le script ci-dessous. Le script de déploiement
  l'utilise aussi pour récupérer ses fichiers d'aide et, sauf si vous passez `--my-ip`, pour
  détecter l'IP publique avec `ifconfig.me`. Le script de suppression n'a besoin que de `jq`.
- Utilisez un client RDP sur un appareil déjà connecté au maillage : Remote Desktop Connection sous
  Windows, Windows App (anciennement Microsoft Remote Desktop) depuis l'App Store macOS, ou Remmina
  ou FreeRDP sous Linux. L'IP du niveau du bureau n'est accessible que depuis le niveau ou le
  maillage.

:::note

Ce script et le script de suppression ont besoin de bash. Il est natif sous macOS et Linux. Sous
Windows, utilisez WSL ou Git Bash.

:::

## Exécuter le script

Le déploiement de la VM de bureau, de sa connexion cloud-init et de l'interface réseau du niveau est
assuré par un seul script, `zcp/deploy-employee-desktop.sh`, du dépôt
[zsoftly/tools](https://github.com/zsoftly/tools). Il suit les phases expliquées ci-dessous.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zsoftly/tools/main/zcp/deploy-employee-desktop.sh) \
  --name jane-doe-desktop --tier-name my-workspace-tier --username janedoe --ssh-key my-key
```

Ce guide utilise `jane-doe-desktop` pour `--name`, `janedoe` pour `--username` et
`my-workspace-tier` pour le niveau de l'exemple précédent `my-workspace`. Vos valeurs seront
différentes.

Omettez `--password` pour que le script génère localement un mot de passe aléatoire robuste et
l'affiche avant la création de la VM puis dans le résumé final. Enregistrez-le : il ne sera plus
affiché lors d'une nouvelle exécution. Passez `--password` uniquement si vous avez besoin d'une
valeur précise.

Le script récupère `ZCP_REGION` et `ZCP_PROJECT` dans votre shell si vous les avez exportés. Sinon,
passez `--region` et `--project`.

| Indicateur           | Rôle                                              | Valeur par défaut ou exigence                                |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `--name`             | Nom exact de la VM de bureau                      | Obligatoire                                                  |
| `--tier-name`        | Niveau privé existant à attacher                  | Obligatoire                                                  |
| `--username`         | Connexion au bureau provisionnée par cloud-init   | Obligatoire                                                  |
| `--ssh-key`          | Nom de clé utilisé par la VM                      | Obligatoire                                                  |
| `--password`         | Mot de passe de la connexion au bureau            | Généré localement et affiché avant la création puis à la fin |
| `--region`           | Slug de région zcp                                | Obligatoire (indicateur ou variable d'environnement)         |
| `--project`          | Slug de projet zcp                                | Obligatoire (indicateur ou variable d'environnement)         |
| `--my-ip`            | Votre IP publique au format CIDR pour limiter SSH | Détectée par `ifconfig.me`, avec `/32`                       |
| `--vm-template`      | Slug du modèle Marketplace ubuntukde              | Détecté automatiquement, version 1.0.2 ou ultérieure         |
| `--vm-plan`          | Plan de calcul de la VM                           | Plus petit plan répondant au minimum de 4 vCPU/16GB          |
| `--network-plan`     | Plan réseau de l'IP publique                      | Détecté automatiquement                                      |
| `--storage-category` | Catégorie de stockage du disque racine            | Détectée automatiquement                                     |
| `--billing-cycle`    | `hourly` ou `monthly`                             | `hourly`                                                     |
| `--ssh-wait`         | Secondes d'attente de SSH                         | `180`                                                        |
| `--cloud-init-wait`  | Secondes d'attente du provisionnement             | `1800`                                                       |
| `--adopt-existing`   | Continuer si une VM portant `--name` existe       | Désactivé                                                    |
| `-y`/`--yes`         | Ignorer l'invite de confirmation                  | Désactivé                                                    |

`--tier-name` n'est pas détecté automatiquement. Un compte peut contenir plusieurs niveaux privés et
deviner le bon niveau représente un risque réel d'isolation. Le script échoue si le nom ne
correspond pas à exactement un niveau.

Si une VM appelée `--name` existe déjà, le script s'arrête et affiche son slug au lieu de supposer
qu'elle vient d'une exécution antérieure. Vérifiez d'abord le slug avec `zcp instance list`. Si
c'est bien la VM voulue, relancez avec `--adopt-existing` pour attacher le niveau, limiter SSH et
continuer. cloud-init ne s'exécute pas de nouveau sur une VM adoptée : `--password` est ignoré et
`--username` doit correspondre à sa connexion existante.

`--username` doit correspondre à `^[a-z][a-z0-9_]*$` (lettres minuscules, chiffres et traits de
soulignement, en commençant par une lettre), avec au plus 32 caractères. Le script le vérifie avant
toute création. Il refuse aussi les noms réservés, dont `ubuntu`, `xrdp`, `sddm`, `sshd` et
`polkitd`, vérifiés sur l'image elle-même. Choisir l'un d'eux garantit une collision. Utilisez
`--help` pour la liste complète des indicateurs.

## Ce que construit le script

### Sélection du modèle et contrôle de version

**Le script trouve le modèle ubuntukde et refuse toute version plus ancienne que celle validée pour
ce tutoriel.**

Sans `--vm-template`, le script détecte automatiquement le modèle ubuntukde.
`zcp template list | grep -i ubuntukde` montre le principe, mais le script exécute lui-même
`zcp template list -o json | jq -r '.[] | select(.name | test("ubuntukde";"i")) | .slug' | head -1`
pour choisir le premier résultat par programmation.

Il choisit le premier résultat, extrait la version de l'application dans le nom du modèle (le champ
`.version` de l'API indique la version de l'OS, par exemple `24.04 LTS`) et exige au moins `1.0.2`.

:::note

La version `1.0.2` corrige un bug réel : les applications confinées par snap, comme Firefox et
Chromium, ne se lançaient pas via RDP à cause d'une variable d'environnement manquante. Le script
refuse les modèles plus anciens. `--vm-template` permet seulement de fixer un modèle 1.0.2 ou
ultérieur et ne contourne pas ce contrôle.

:::

### La VM de bureau

**Le script attribue délibérément une IP publique à la VM, puis la limite à SSH depuis votre
adresse. RDP n'est jamais ouvert publiquement.**

Une VM sans empreinte réseau publique paraît plus privée, mais cette plateforme n'offre ni console
ni accès de récupération. Si la configuration ponctuelle de l'interface du niveau échoue, une VM
inaccessible le reste. Le script déploie donc normalement, attribue une IP publique et limite SSH à
votre IP. L'IP publique ne sert qu'à l'administration limitée.

Le script attache la VM au niveau nommé avec `add-network`, comme les scripts des tutoriels
précédents.

:::note

4 vCPU/16GB constituent une base confortable. 4 vCPU/8GB restent utilisables mais sensiblement moins
réactifs. Sans `--vm-plan`, le script choisit le plus petit plan qui atteint 4 vCPU/16GB et échoue
si aucun n'existe dans votre compte ou votre région. Passez `--vm-plan` pour fixer un plan précis.

:::

### L'utilisateur cloud-init du bureau

**Chaque employé reçoit une connexion nommée par cloud-init, et non l'utilisateur par défaut généré
par le modèle.**

Le script écrit une petite configuration cloud-config dans un fichier temporaire local, réservé au
propriétaire et supprimé à la sortie, puis la passe avec `--user-data-file` :

```yaml
#cloud-config
write_files:
  - path: /etc/zmi/deploy.env
    permissions: '0600'
    owner: root:root
    content: |
      UBUNTUKDE_USERNAME=janedoe
      UBUNTUKDE_PASSWORD=<generated-or-provided-password>
```

:::caution

Le script de premier démarrage du modèle refuse certains noms. Les essais ont confirmé qu'un nom
contenant un point échoue avec `invalid desktop username` et ne crée jamais l'utilisateur. C'est
pourquoi `--username` est vérifié par rapport à `^[a-z][a-z0-9_]*$` avant toute création. La liste
de noms réservés ci-dessus entre en collision de la même manière, mais pas de façon identique.
`ubuntu` est l'utilisateur SSH administrateur de ce script. Le script de premier démarrage
réinitialise son mot de passe sans condition. Choisir `ubuntu` réussit donc le contrôle de
disponibilité mais remplace le mot de passe administrateur SSH par celui du bureau. Les autres noms
(`xrdp`, `sddm`, `sshd`, `polkitd` et d'autres) échouent différemment : aucun ne possède de
répertoire personnel sous `/home`, le provisionnement de premier démarrage échoue donc complètement
et le bureau n'est jamais provisionné. Seul l'échec de ce second groupe apparaît après le délai
complet `--cloud-init-wait`, alors que la VM est déjà facturable. `ubuntu` n'expire pas, puisqu'il
réussit le contrôle de disponibilité. La vérification préalable refuse tous les noms réservés avant
la création de la VM. Aucun de ces cas ne se produit donc en pratique.

:::

:::caution

Sans `--password`, le script génère localement un mot de passe alphanumérique robuste et l'affiche
avant la création puis dans le résumé final. Si l'appel de création échoue tout en créant la VM,
vous avez déjà vu le mot de passe. Enregistrez-le. Un mot de passe explicite apparaît dans
l'historique du shell ou la liste des processus. Il doit comporter au moins 8 caractères et utiliser
uniquement lettres, chiffres et `!#%+,./:=?@^_-`. Le script du modèle charge le fichier cloud-init
avec la sémantique du shell : d'autres caractères pourraient l'altérer ou être exécutés.

:::

### Limitation SSH

**Le script détecte et supprime la règle SSH par défaut du modèle, ouverte à toutes les adresses.
Seule votre IP conserve l'accès.**

Les modèles Marketplace App reçoivent lors du déploiement une règle SSH ouverte à `0.0.0.0/0`, pour
les ports TCP et UDP 22. Le script crée d'abord une règle limitée à votre IP, confirme son
existence, supprime la règle ouverte, puis confirme qu'aucune règle `0.0.0.0/0` ne reste sur le
port 22. C'est la même limitation que `build-private-network.sh` applique à ses propres VM.

Lors d'une nouvelle exécution, il supprime aussi toute règle du port 22 limitée à une IP différente
de celle de l'exécution actuelle et affiche `[WARN]`. Si votre IP publique a changé, l'ancien accès
est révoqué.

### Interface réseau du niveau

**L'interface du niveau est activée comme sur le routeur de sous-réseau et la VM de stockage.**

La plateforme ajoute l'interface à chaud, mais le système d'exploitation ne l'active pas
automatiquement. Le script écrit et applique un fichier netplan, puis vérifie que l'adresse obtenue
appartient au CIDR du niveau.

:::note

Netplan peut avertir que les permissions de son fichier sont « trop ouvertes ». C'est attendu et
sans conséquence. La configuration est appliquée.

:::

### Confirmer que le bureau est prêt

**Le script attend l'existence de la connexion cloud-init au lieu de supposer que SSH signifie la
fin du provisionnement.**

Le script attend d'abord SSH pendant au plus 3 minutes par défaut (`--ssh-wait`). Le provisionnement
KDE au premier démarrage continue souvent plusieurs minutes après que SSH est accessible. Il attend
donc aussi le marqueur de fin du script de premier démarrage et le service xrdp actif, en plus d'un
nom d'utilisateur avec UID humain (1000 ou plus), pendant au plus 30 minutes (`--cloud-init-wait`).

Si l'une des attentes expire, le script échoue au lieu d'attendre indéfiniment. La VM existe alors
déjà : relancez avec `--adopt-existing` après avoir confirmé avec `zcp instance get <slug>` qu'il
s'agit de la bonne VM. Augmentez le délai si nécessaire. Pour cloud-init, l'erreur indique aussi
`sudo journalctl -u ubuntukde-first-boot`. Cette unité crée l'utilisateur, définit le mot de passe
et démarre xrdp après `cloud-final`.

:::caution

Si l'utilisateur du bureau existe mais que vous avez perdu son mot de passe après un échec entre la
création de la VM et le résumé final, `sudo passwd <username>` par SSH le réinitialise.

:::

## Inspecter les ressources créées

```bash
zcp instance list
zcp ip list
```

## Attribuer à ce bureau une identité unique pour le stockage partagé

Cette étape ne concerne que les bureaux qui monteront le stockage privé partagé et elle est plus
simple avant la première connexion de l'employé. NFS associe directement les numéros UID, pas les
noms. `useradd` attribue des UID séquentiels à partir de 1000. Comme chaque VM de bureau ne crée
qu'un utilisateur personnalisé, chaque connexion reçoit par défaut le même UID (en général `1001`),
quelle que soit son nom.

:::note

**Par défaut : acceptez ce comportement.** Si vous n'utilisez pas le stockage partagé, ou si une
zone d'équipe de confiance convient à votre organisation, aucune action n'est nécessaire.

:::

Pour attribuer une identité unique, utilisez `usermod` et `groupmod` avant la première connexion.
L'IP publique figure dans le résumé du script ou dans `zcp ip list` :

```bash
ssh ubuntu@<desktop-public-ip>

sudo usermod -u 2001 janedoe
sudo groupmod -g 2001 janedoe
sudo find /home/janedoe -exec chown -h 2001:2001 {} +
id janedoe
```

Choisissez une valeur unique pour chaque employé dans toute votre flotte.

:::caution

Conservez l'association UID-employé dans un emplacement durable. Si l'employé s'est déjà connecté,
`usermod` refuse tant que sa session est active, et fermer le client RDP ne la termine pas.
Redémarrez la VM ou terminez directement la session avant de recommencer.

:::

## Se connecter avec RDP

Exécutez le client RDP depuis un appareil déjà connecté au maillage. L'IP du niveau du bureau n'est
accessible que depuis le niveau ou le maillage. Connectez-vous à l'IP du niveau imprimée dans le
résumé, jamais à l'IP publique. RDP n'a jamais été ouvert publiquement. Seul SSH y est ouvert, et il
est limité à votre IP.

- Adresse : l'IP du niveau dans le résumé, par exemple `10.20.1.57`
- Nom d'utilisateur et mot de passe : la valeur de `--username` et le mot de passe du résumé

:::note

- À la première connexion, KDE peut afficher l'invite PolicyKit « System policy prevents control of
  network connections. » Saisissez le mot de passe de l'employé pour continuer.
- Si tout paraît minuscule alors que la fenêtre RDP remplit l'écran, définissez une résolution
  explicite dans le client au lieu d'utiliser la négociation automatique.
- Le modèle désactive délibérément le compositeur KWin et réduit la profondeur de couleur RDP pour
  privilégier les performances du chemin de rendu RDP sans GPU.

:::

## Vérifier le bureau de bout en bout

Lancez Firefox ou Chromium depuis le lanceur KDE, puis ouvrez un terminal. Le contrôle de version
rejette les images antérieures à `1.0.2` parce que les applications y clignotent et se ferment
immédiatement via RDP. Vérifiez aussi l'accès Internet depuis la session.

:::note

Le xrdp de ce modèle ne prend pas en charge H.264/AVC444, seulement RFX et le bitmap brut. Les
contenus vidéo changeants fonctionnent donc mal. Faites les appels vidéo localement sur la machine
de l'employé et partagez la fenêtre du client RDP au lieu de rejoindre l'appel depuis la session.

:::

## Vérifier l'isolation

```bash
# from the public internet:
nc -zv -w 3 <desktop-public-ip> 3389
```

Cette commande échoue (connexion refusée ou délai dépassé). L'IP publique du bureau, indiquée dans
le résumé ou par `zcp ip list`, ne laisse SSH accessible que depuis votre IP. RDP est accessible
uniquement dans le niveau ou via le maillage.

:::note

Sous Debian ou Ubuntu, installez d'abord `nc` si nécessaire avec
`sudo apt-get install -y netcat-openbsd`. macOS fournit déjà son propre `nc`. Il se comporte de la
même manière dans tous les shells. `/dev/tcp/<host>/<port>` est propre à bash et échoue dans des
shells comme zsh.

:::

Vous pouvez aussi confirmer cela côté pare-feu :

```bash
zcp firewall list --ip <ip-slug>
```

`<ip-slug>` est affiché par `zcp ip list`. La seule règle de pare-feu visible sur l'IP publique du
bureau doit être la règle SSH limitée décrite ci-dessus. `zcp portforward list --ip <ip-slug>`
affiche toujours les redirections TCP et UDP du port 22 du modèle, Active, même après la limitation.
C'est attendu : une redirection sans règle de pare-feu correspondante n'achemine rien. Le pare-feu
est le contrôle effectif.

## Nettoyer

La facturation horaire s'applique tant que cette VM existe. Contrairement au tutoriel de stockage,
aucun volume compagnon ne doit être supprimé.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zsoftly/tools/main/zcp/destroy-employee-desktop.sh) \
  --name jane-doe-desktop
```

Le script récupère `ZCP_REGION` et `ZCP_PROJECT` dans votre shell comme le script de déploiement.
Sinon, passez `--region` et `--project`. Il échoue sans l'un ou l'autre et ne demande pas sa propre
confirmation.

:::caution

Cette VM dispose d'une IP publique. Son déploiement a donc aussi créé un réseau autonome et une IP
source-NAT épinglée. `instance delete` ne supprime ni l'un ni l'autre. Le script détecte et signale
un reste, comme les scripts de suppression précédents. Vérifiez sa sortie. S'il y en a un,
retirez-le du portail web CMP en recherchant l'ID réseau imprimé. Un reste confirmé donne un code de
sortie non nul, vérifiez donc `$?`. Un échec de suppression non confirmé, affiché comme `[WARN]`,
produit aussi une sortie non nulle. Examinez les lignes `[WARN]` avant de conclure.

:::

## Récapitulatif

1. Déployez une VM de bureau dans le niveau avec une connexion cloud-init nommée :
   `deploy-employee-desktop.sh --name jane-doe-desktop --tier-name <tier-name> --username janedoe --ssh-key <name>`.
2. Le script choisit le modèle ubuntukde (version 1.0.2 ou ultérieure), limite SSH à votre IP et
   active l'interface du niveau.
3. Réattribuez facultativement l'UID de la connexion par SSH avant la première connexion de
   l'employé si ce bureau montera le stockage partagé.
4. Connectez-vous par RDP depuis le maillage à l'IP du niveau du résumé, jamais à l'IP publique.
   Vérifiez Firefox ou Chromium et un terminal, puis confirmez que seule SSH est accessible sur l'IP
   publique.
5. Exécutez `destroy-employee-desktop.sh --name <name>` à la fin et cherchez un réseau résiduel.

## Étapes suivantes

La prochaine partie de cette série, qui consiste à connecter ces bureaux au stockage partagé privé
et à rendre la configuration opérationnelle pour une équipe, est toujours en cours. En attendant :

- [Créer un réseau privé avec Headscale](/tutorials/build-private-network-headscale) : le niveau et
  le maillage
- [Déployer un stockage partagé privé](/tutorials/deploy-private-shared-storage) : un partage NFS
  dans le même niveau
- [Référence CLI](/public-cloud/cli/reference) : chaque commande et indicateur
- [Vue d'ensemble des tutoriels](/tutorials) : la liste complète des tutoriels

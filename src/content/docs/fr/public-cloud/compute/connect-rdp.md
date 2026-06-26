---
title: Se connecter avec RDP
sidebar_position: 4
---

Remote Desktop Protocol (RDP) vous permet de vous connecter de façon sécurisée à des VM Windows et
de les gérer à distance.

## Accéder à la vue d'ensemble de l'instance

- Allez à **Instances** et sélectionnez la VM Windows.
- Dans l'onglet **VM Overview**, repérez et copiez les champs **Nom d'utilisateur** et **Mot de
  passe**.

![Vue d'ensemble de l'instance affichant le nom d'utilisateur et le mot de passe utilisés pour RDP](../../../../../assets/compute/connect-rdp-access-the-instance-overview.webp)

## Lancer le client RDP

- **Windows** : appuyez sur Win+R, tapez `mstsc`, puis appuyez sur Entrée. Vous pouvez aussi
  rechercher "Remote Desktop Connection" dans le menu Démarrer.
- **macOS** : téléchargez **Microsoft Remote Desktop** depuis le Mac App Store.
- **Linux** : installez **Remmina** (`sudo apt install remmina` sur Ubuntu/Debian), ouvrez Remmina
  et sélectionnez RDP.

![Lancement du client RDP](../../../../../assets/compute/connect-rdp-launch-the-rdp-client.webp)

## Connexion

1. Trouvez l'**Adresse IP publique** de votre VM dans l'onglet Overview.
2. Entrez l'adresse IP publique dans le client RDP.
3. Entrez le **Nom d'utilisateur** et le **Mot de passe** copiés depuis le portail.
4. Si un avertissement de sécurité s'affiche, cochez "Don't ask me again for connections to this
   computer", puis cliquez sur **Yes**.
5. Cliquez sur **OK** ou **Connect**.

![Connexion à la VM via RDP](../../../../../assets/compute/connect-rdp-connect.webp)

## Voir aussi

- [Se connecter avec SSH](/fr/public-cloud/compute/connect-ssh)
- [Accès à la console](/fr/public-cloud/compute/console-access)

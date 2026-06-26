---
title: Windows Server
description:
  Windows Server sur ZCP, y compris les éditions disponibles et à venir (2022 et 2025, Standard et
  Datacenter), l'usage de chaque édition, l'activation par apport de votre propre licence, les
  étapes de première connexion et des liens vers la documentation officielle de Microsoft.
---

Les images **Windows Server** de ZCP sont livrées avec les pilotes paravirtuels et l'agent invité
nécessaires à de bonnes performances et à une gestion propre, et définissent un mot de passe
administrateur unique au premier démarrage pour une connexion immédiate.

Windows Server est sous licence **apportez votre propre licence (BYOL)**. Les images ne sont pas
activées, et vous fournissez votre propre licence Windows Server valide. Consultez
[Licences](#licences--apportez-votre-propre-licence-byol) ci-dessous.

:::tip

**Windows Server est disponible sous BYOL :** 2025 en éditions Standard et Datacenter, ainsi que
2022 Standard. Windows Server 2022 Datacenter est encore en préparation.

:::

## Disponibilité

ZCP offre la gamme Windows Server pour les versions **2022** et **2025** dans les éditions
**Standard** et **Datacenter**.

| Version             | Édition    | Statut        |
| ------------------- | ---------- | ------------- |
| Windows Server 2025 | Standard   | ✅ Disponible |
| Windows Server 2025 | Datacenter | ✅ Disponible |
| Windows Server 2022 | Standard   | ✅ Disponible |
| Windows Server 2022 | Datacenter | 🚧 À venir    |

## Éditions : Standard et Datacenter

Les deux éditions partagent le même système d'exploitation Windows Server de base, les mêmes rôles
et le même outillage de gestion. La différence porte sur les droits de virtualisation et les
fonctionnalités avancées de centre de données défini par logiciel.

| Capacité                                                 | Standard                 | Datacenter                  |
| -------------------------------------------------------- | ------------------------ | --------------------------- |
| Système d'exploitation, rôles et fonctionnalités de base | Complet                  | Complet                     |
| Droits de virtualisation (par licence)                   | Limités (faible densité) | Haute densité / illimités\* |
| Storage Spaces Direct (S2D)                              | Non inclus               | ✅                          |
| Software-Defined Networking (SDN)                        | Non inclus               | ✅                          |
| Shielded VMs / Host Guardian                             | Non inclus               | ✅                          |

\* Les vastes droits de virtualisation de Datacenter sont un avantage de licence lié à l'hôte
physique. Confirmez comment votre droit d'utilisation s'applique aux instances hébergées/en nuage
auprès de Microsoft ou de votre revendeur.

## Cas d'usage

### Windows Server 2022 Standard

Le choix par défaut pour la plupart des charges de travail Windows :

- Contrôleurs de domaine **Active Directory**, DNS et DHCP pour un environnement Windows.
- Serveurs de **fichiers et d'impression**, y compris DFS et Storage Replica pour les données de
  succursale/siège social.
- Hébergement **web et applicatif IIS**, serveurs d'applications .NET et intergiciels.
- **Hébergement de bases de données** (p. ex. SQL Server) pour les applications métier.
- Rôles serveur à usage général et à faible densité où vous exécutez une charge de travail par
  instance.

### Windows Server 2022 Datacenter (À venir)

L'ensemble complet des fonctionnalités de Standard, plus les capacités de centre de données défini
par logiciel :

- **Virtualisation à haute densité** où de nombreux invités Windows Server s'exécutent sur le même
  hôte sous licence.
- **Infrastructure hyperconvergée** utilisant Storage Spaces Direct (S2D) pour le stockage défini
  par logiciel.
- **Software-Defined Networking** avec le Network Controller pour la micro-segmentation et les
  politiques.
- **Shielded VMs** pour des charges de travail invitées renforcées et chiffrées dans les
  environnements réglementés.

### Windows Server 2025 Standard

La même couverture de rôles que 2022 Standard, sur la version Long-Term Servicing Channel la plus
récente :

- Nouvelles charges de travail qui devraient démarrer sur le **LTSC le plus récent** pour la plus
  longue durée de support.
- Accès aux fichiers moderne avec **SMB over QUIC** pour un accès sécurisé sans VPN.
- Réduction des redémarrages grâce au **hotpatching** pour maintenir les services disponibles
  pendant les mises à jour.
- Amélioration d'Active Directory, des valeurs de sécurité par défaut et de l'expérience de gestion.

### Windows Server 2025 Datacenter

L'ensemble des fonctionnalités de 2025, plus toutes les capacités de Datacenter :

- Constructions **hyperconvergées et de centre de données défini par logiciel** sur la version la
  plus récente.
- **Partitionnement de GPU** et virtualisation avancée pour l'IA/le graphisme et la consolidation
  dense.
- La plus longue durée de support pour les parcs de **stockage et de réseau définis par logiciel**.

## Licences : apportez votre propre licence (BYOL)

Les images Windows Server sont fournies **sans licence**. ZCP n'inclut ni ne vend de licence Windows
Server avec l'instance. Vous devez fournir et activer la vôtre. Tant que vous n'avez pas activé,
l'instance fonctionne comme une copie non activée de Windows Server, mais elle reste par ailleurs
pleinement utilisable.

:::caution

Il vous incombe de détenir une licence Windows Server valide (et toute CAL requise) dont les
conditions permettent l'utilisation sur une infrastructure hébergée ou en nuage, et de maintenir
cette licence conforme. Les droits d'édition (Standard et Datacenter) et les droits de
virtualisation diffèrent. Confirmez votre droit d'utilisation auprès de Microsoft ou de votre
revendeur avant de vous appuyer sur une instance Windows pour la production.

:::

### Activer après la première connexion

Connectez-vous (consultez [Première connexion](#première-connexion)), puis activez avec la méthode
qui correspond à votre licence, depuis une session PowerShell avec élévation :

- **Clé Retail / MAK**

  ```powershell
  slmgr /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
  slmgr /ato
  ```

- **Licences en volume (KMS)** : pointez l'instance vers votre hôte KMS :

  ```powershell
  slmgr /skms your-kms-host:1688
  slmgr /ato
  ```

Confirmez l'activation avec `slmgr /xpr`.

## Déployer une instance Windows Server

1. Allez à **Compute → Create Instance** (consultez
   [Créer une instance](/fr/public-cloud/compute/create-instance/)).
2. Choisissez une image **Windows Server**. Éditions disponibles : Windows Server 2025 (Standard et
   Datacenter) et Windows Server 2022 Standard. Windows Server 2022 Datacenter est en préparation.
3. Sélectionnez une région et un forfait. Windows Server nécessite au moins **4 Go de RAM et 2
   vCPU**. Dimensionnez le forfait pour votre charge de travail, et non pour le minimum.
4. Rattachez à un réseau et créez l'instance.

## Première connexion

1. Ouvrez votre instance et récupérez son **mot de passe admin généré automatiquement** depuis le
   portail (l'image définit un mot de passe unique par instance au premier démarrage).
2. Connectez-vous avec **Remote Desktop (RDP)** à l'IP publique de l'instance. Consultez
   [Se connecter avec RDP](/fr/public-cloud/compute/connect-rdp/), ou utilisez
   [Accès console](/fr/public-cloud/compute/console-access/) depuis le portail.
3. Connectez-vous en tant que **`Administrator`** avec ce mot de passe.

:::tip

Régénérez le mot de passe admin depuis le portail à tout moment. Le nouveau mot de passe s'applique
après le redémarrage suivant. Gardez RDP verrouillé avec une
[règle de pare-feu](/fr/public-cloud/compute/settings/firewall/) qui n'autorise le port 3389 que
depuis vos propres IP.

:::

## Premières étapes recommandées

- **Activez Windows Server** avec votre licence (consultez
  [Licences](#licences--apportez-votre-propre-licence-byol)).
- Changez le mot de passe `Administrator` pour un mot de passe connu de vous seul.
- Définissez le fuseau horaire et exécutez **Windows Update**.
- N'ajoutez que les rôles et fonctionnalités de serveur dont vous avez besoin.

## Documentation Microsoft

Pour l'administration de Windows Server, les rôles et fonctionnalités, les éditions, les licences et
les conseils de sécurité, consultez la documentation officielle de Microsoft :

- [Documentation Windows Server](https://learn.microsoft.com/en-us/windows-server/)
- [Documentation Windows Server 2025](https://learn.microsoft.com/en-us/windows-server/get-started/whats-new-windows-server-2025)
- [Comparer les éditions Standard et Datacenter](https://learn.microsoft.com/en-us/windows-server/get-started/editions-comparison-windows-server-2022)
- [Licences Windows Server 2022](https://learn.microsoft.com/en-us/windows-server/get-started/windows-server-2022-licensing)

## Bon à savoir

- **Les instantanés et les sauvegardes** fonctionnent avec l'agent invité installé. Consultez
  [Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots/) et
  [Sauvegardes](/fr/public-cloud/backups-snapshots/backups/).
- Les images sont reconstruites et revalidées à chaque version. Les instances existantes ne sont pas
  affectées.
- Pour un système d'exploitation client de bureau, consultez
  [Windows 11 Pro](/fr/public-cloud/operating-systems/windows-11/).
- Pour le catalogue complet d'images, consultez
  [Images de systèmes d'exploitation](/fr/public-cloud/operating-systems/).

---
title: Windows 11 Pro
description:
  Déployez une instance Windows 11 Pro sur ZCP, y compris ce que comprend l'image, l'activation par
  apport de votre propre licence et les étapes de première connexion.
---

ZCP offre une image **Windows 11 Pro (64 bits)**, disponible dans chaque région. Elle démarre avec
le micrologiciel requis par Windows 11 (UEFI Secure Boot et un dispositif TPM 2.0), est livrée avec
les pilotes et les agents nécessaires à de bonnes performances et à une gestion propre, et définit
un mot de passe administrateur unique au premier démarrage pour une connexion immédiate.

Windows 11 est sous licence **apportez votre propre licence (BYOL)**. L'image n'est pas activée, et
vous fournissez votre propre licence Windows 11 valide. Consultez
[Licences](#licences--apportez-votre-propre-licence-byol) ci-dessous.

:::tip

**Windows 11 Pro est validée et disponible** dans chaque région.

:::

## Ce qui est inclus

| Composant                          | Détail                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| Système d'exploitation             | Windows 11 Pro, 64 bits                                                         |
| Micrologiciel                      | UEFI + Secure Boot + TPM 2.0 (répond aux exigences de Windows 11)               |
| Pilotes paravirtuels               | Préinstallés pour des E/S disque et réseau rapides                              |
| Agent invité                       | Arrêt/redémarrage gracieux et instantanés de VM cohérents avec les applications |
| Configuration au premier démarrage | Définit automatiquement un mot de passe admin unique et le nom d'hôte           |
| Régions                            | Montréal et Ottawa                                                              |
| Activation                         | Non activée. Apportez votre propre licence (BYOL)                               |

Comme le TPM et Secure Boot sont présents, des fonctionnalités telles que le chiffrement de lecteur
BitLocker et Windows Hello sont disponibles une fois Windows activé.

## Licences : apportez votre propre licence (BYOL)

L'image Windows 11 Pro est fournie **sans licence**. ZCP n'inclut ni ne vend de licence client
Windows avec l'instance. Vous devez fournir et activer la vôtre. Tant que vous n'avez pas activé,
l'instance fonctionne comme une copie non activée de Windows (un filigrane apparaît sur le bureau et
certains paramètres de personnalisation sont verrouillés), mais elle reste par ailleurs pleinement
utilisable.

:::caution

Il vous incombe de détenir une licence Windows 11 valide dont les conditions permettent
l'utilisation sur une infrastructure hébergée ou en nuage, et de maintenir cette licence conforme.
Confirmez votre droit d'utilisation auprès de Microsoft ou de votre revendeur avant de vous appuyer
sur une instance Windows pour la production.

:::

### Activer après la première connexion

Connectez-vous (consultez [Première connexion](#première-connexion)), puis activez avec la méthode
qui correspond à votre licence :

- **Clé de produit Retail / OEM** : Paramètres → Système → Activation → Modifier la clé de produit,
  ou depuis une session PowerShell avec élévation :

  ```powershell
  slmgr /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
  slmgr /ato
  ```

- **Licences en volume (MAK)** : entrez votre clé MAK de la même façon (`slmgr /ipk` puis
  `slmgr /ato`).
- **Licences en volume (KMS)** : pointez l'instance vers votre hôte KMS :

  ```powershell
  slmgr /skms your-kms-host:1688
  slmgr /ato
  ```

Confirmez l'activation avec `slmgr /xpr` ou dans Paramètres → Activation.

## Déployer une instance Windows 11 Pro

1. Allez à **Compute → Create Instance** (consultez
   [Créer une instance](/fr/public-cloud/compute/create-instance/)).
2. Choisissez l'image **Windows 11 Pro**.
3. Sélectionnez une région et un forfait. Windows 11 nécessite au moins **4 Go de RAM et 2 vCPU**.
   **8 Go de RAM** sont recommandés pour un bureau réactif.
4. Rattachez à un réseau et créez l'instance.

L'instance démarre directement jusqu'au bureau Windows. Il n'y a pas d'assistant de configuration ni
d'invites de région/clavier.

:::note

Les forfaits Windows sont plus grands que les forfaits Linux parce que le système d'exploitation de
bureau a besoin de plus de mémoire et de disque. Dimensionnez le forfait pour votre charge de
travail, et non pour le minimum.

:::

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

- **Activez Windows** avec votre licence (consultez
  [Licences](#licences--apportez-votre-propre-licence-byol)).
- Changez le mot de passe `Administrator` pour un mot de passe connu de vous seul.
- Définissez le fuseau horaire et exécutez **Windows Update**.
- Si vous stockez des données sensibles, activez **BitLocker** (le TPM 2.0 le sécurise
  automatiquement).

## Documentation Microsoft

Pour les fonctionnalités, l'administration et les détails de licence de Windows 11, consultez la
documentation officielle de Microsoft :

- [Documentation Windows 11](https://learn.microsoft.com/en-us/windows/)
- [Activer Windows](https://support.microsoft.com/en-us/windows/activate-windows-c39005d4-95ee-b91e-b399-2820fda32227)

## Bon à savoir

- **Les instantanés et les sauvegardes** fonctionnent avec l'agent invité installé. Consultez
  [Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots/) et
  [Sauvegardes](/fr/public-cloud/backups-snapshots/backups/).
- L'image est reconstruite et revalidée à chaque version. Les instances existantes ne sont pas
  affectées.
- Seul Windows 11 **Pro** est offert comme image client hébergée aujourd'hui. Pour le système
  d'exploitation serveur, consultez
  [Windows Server](/fr/public-cloud/operating-systems/windows-server/).
- Pour le catalogue complet d'images, consultez
  [Images de systèmes d'exploitation](/fr/public-cloud/operating-systems/).

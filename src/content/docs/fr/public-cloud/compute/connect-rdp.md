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

## Si la connexion RDP échoue

RDP écoute sur le port TCP **3389** dans la VM. Si une adresse IP publique est directement attribuée
à la VM, autorisez le port TCP 3389 dans la
[règle de pare-feu](/fr/public-cloud/compute/settings/firewall/) et connectez-vous à cette adresse
IP sur le port 3389. Si vous utilisez la
[redirection de ports](/fr/public-cloud/compute/settings/port-forwarding/), associez le port TCP
public configuré au port 3389 de la VM, autorisez le port public dans la règle de pare-feu, puis
connectez-vous à l'adresse IP publique et au port public.

Si la règle de pare-feu est correcte, mais que la connexion échoue toujours, utilisez
l'[accès à la console](./console-access) pour vérifier le système Windows. Ouvrez PowerShell en tant
qu'administrateur et exécutez les commandes suivantes :

```powershell
Set-ItemProperty `
  -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" `
  -Name "fDenyTSConnections" `
  -Value 0

Enable-NetFirewallRule -Group "@FirewallAPI.dll,-28752"

Set-Service TermService -StartupType Automatic
Set-Service UmRdpService -StartupType Automatic
Start-Service TermService
Start-Service UmRdpService

$services = Get-Service -Name TermService,UmRdpService
$services | Select-Object Name,Status,StartType

$termServicePid = (Get-CimInstance Win32_Service -Filter "Name='TermService'").ProcessId
$listeners = Get-NetTCPConnection -LocalPort 3389 -State Listen
$listeners | Select-Object LocalAddress,LocalPort,OwningProcess

if ($services | Where-Object { $_.Status -ne 'Running' }) {
  throw "TermService and UmRdpService must both be Running"
}
if ($listeners.OwningProcess -notcontains $termServicePid) {
  throw "The port 3389 listener does not belong to TermService"
}
"RDP listener matches TermService PID $termServicePid"
```

Vérifiez que `TermService` et `UmRdpService` affichent l'état `Running` et que la vérification de
l'écouteur correspond au PID de `TermService`. Essayez ensuite de vous connecter à nouveau avec RDP.

![PowerShell administrateur montrant le service Remote Desktop en cours d'exécution et le port 3389 à l'écoute](../../../../../assets/compute/connect-rdp-console-enable-service.webp)

## Voir aussi

- [Se connecter avec SSH](/fr/public-cloud/compute/connect-ssh)
- [Accès à la console](/fr/public-cloud/compute/console-access)

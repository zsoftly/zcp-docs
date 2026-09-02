---
title: OPNsense
---

OPNsense is an open-source firewall and router platform based on FreeBSD. The ZCP marketplace image
is a pre-installed OPNsense system, not a live installer, and is intended for firewall, routing,
VPN, and network security use cases.

## Software included

| Component | Version |
| --------- | ------- |
| OPNsense  | 26.7.1  |
| FreeBSD   | 15.1    |

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 4 GB    | 8 GB        |

## Deployment model

OPNsense is different from most ZCP marketplace images:

- It does not use cloud-init.
- It does not provide SSH access by default.
- It is managed first through the CloudStack console.
- Its web GUI is available only after the LAN interface is configured.

On first boot, OPNsense uses its default LAN address:

```text
192.168.1.1/24
```

That address may not match the IP assigned by CloudStack. Reconfigure the LAN interface from the
console before expecting the web GUI to be reachable.

## Getting started

### 1. Open the VM console

In the CloudStack UI, open the VM and select **View Console**.

### 2. Log in with the vendor defaults

| Interface | Username | Password   |
| --------- | -------- | ---------- |
| Console   | `root`   | `opnsense` |
| Web GUI   | `root`   | `opnsense` |

Change this password immediately after first login.

### 3. Configure the LAN interface

From the console menu, select:

```text
2) Set interface IP address
```

Configure the LAN interface with DHCP or a static address that is reachable on your selected
network. After the interface is configured, OPNsense restarts the relevant firewall, DNS, and web
GUI services.

### 4. Open the web GUI

Open:

```text
https://<lan-or-forwarded-ip>/
```

Accept the self-signed certificate warning and log in with `root` / `opnsense`, then change the
password.

## NAT and port-forwarded access

If you access the web GUI through a NAT or port-forwarded address, OPNsense may reject login with an
HTTP referer error because the browser URL does not match an address the appliance recognizes as its
own.

For testing only, you can disable that check from the console shell:

```sh
cp /conf/config.xml /conf/config.xml.bak
sed -i '' 's#</webgui>#<nohttpreferercheck>1</nohttpreferercheck></webgui>#' /conf/config.xml
configctl webgui restart
```

The setting must be inside the `<webgui>` section.

## Ports

OPNsense is the firewall, so customer configuration determines which services are reachable.
Initially, the important service is:

| Port | Protocol | Purpose                  |
| ---- | -------- | ------------------------ |
| 443  | TCP      | Web GUI on LAN interface |

WAN rules, VPN ports, firewall policy, and port forwards are configured by the customer after first
login.

## Security

Change the default password immediately. Avoid exposing the management web GUI to the public
internet. For production, restrict management access to a private network, VPN, or trusted
administrative IP range.

CloudStack may display a generated password for this template, but OPNsense does not consume it
because the image has no cloud-init or guest password agent. Use the vendor defaults until you
change them manually.

## Next steps

- [OPNsense installation and setup](https://docs.opnsense.org/setup.html)
- [OPNsense download](https://opnsense.org/download)

---
title: Composants de la plateforme
sidebar_position: 2
---

ZSoftly Private Cloud est bâti à partir de composants d'infrastructure libres. La pile ci-dessous
est notre **socle recommandé** : la combinaison que nous recommandons et avec laquelle nous avons le
plus d'expérience d'ingénierie. Il s'agit de recommandations et d'options pour votre environnement,
pas d'une pile ZSoftly figée. Rien n'est verrouillé. La force de ZPCP réside dans sa flexibilité et
sa personnalisation. Notre équipe travaille avec les outils que vous utilisez déjà pour le réseau,
les pare-feu, la sécurité et le stockage, remplace des composants selon vos besoins et assemble une
plateforme intégrée qui peut remplacer entièrement VMware vSphere et d'autres outils sous licence.

Cette page décrit la pile recommandée, les solutions de rechange possibles pour chaque couche, et ce
que ZSoftly configure par rapport à ce que vous contrôlez.

## Pile de base recommandée

| Composant                          | Rôle                                                    | Géré par                          |
| ---------------------------------- | ------------------------------------------------------- | --------------------------------- |
| Apache CloudStack                  | Orchestration infonuagique, cycle de vie des VM, réseau | ZSoftly (initial), vous (continu) |
| KVM (Kernel-based Virtual Machine) | Hyperviseur (remplace VMware ESXi)                      | ZSoftly                           |
| Ceph                               | Stockage bloc (RBD) et stockage objet (RGW)             | ZSoftly (initial), vous (continu) |
| OPNsense                           | Pare-feu et routage logiciel libres                     | ZSoftly                           |
| WireGuard                          | VPN pour l'accès distant sécurisé                       | ZSoftly                           |
| Keycloak ou Authentik              | Identité, SSO et connexion sociale                      | ZSoftly (initial), vous (continu) |

Un **portail libre-service à votre image** peut être ajouté au-dessus de la couche d'orchestration
pour vos utilisateurs finaux.

## Flexibilité et solutions de rechange

Rien dans cette pile n'est immuable. Chaque couche peut être remplacée par une solution de rechange
ou intégrée à un outil que vous exploitez déjà. Les ingénieurs de ZSoftly conçoivent la combinaison
qui remplace le mieux votre plateforme VMware vSphere existante ou toute autre plateforme sous
licence.

| Couche                      | Recommandé            | Solutions de rechange                                                       |
| --------------------------- | --------------------- | --------------------------------------------------------------------------- |
| Orchestration               | Apache CloudStack     | OpenStack (entièrement pris en charge)                                      |
| Hyperviseur                 | KVM                   | Standard libre; remplace VMware ESXi                                        |
| Stockage bloc / objet       | Ceph                  | ZFS, NFS ou intégration à votre SAN/NAS existant                            |
| Routeur / pare-feu logiciel | OPNsense              | pfSense, VyOS ou votre pare-feu existant (Fortinet, Palo Alto)              |
| VPN                         | WireGuard             | OpenVPN, IPsec                                                              |
| Identité / SSO              | Keycloak ou Authentik | Google, GitHub, autre connexion sociale ou OIDC/SAML, ou votre IdP existant |

La périphérie réseau est libre et définie par logiciel. OPNsense est notre recommandation, mais il
s'agit d'une option parmi plusieurs routeurs et pare-feu logiciels libres, et non d'une exigence
fixe.

**Identité et authentification unique :** ZPCP inclut le SSO complet et la connexion sociale.
ZSoftly déploie Keycloak ou Authentik et connecte Google, GitHub ainsi que tout autre fournisseur
OIDC ou SAML, ou intègre le système d'identité que vous exploitez déjà.

## Ce que ZSoftly configure

- La disposition des zones, pods et clusters dans CloudStack.
- Les hôtes hyperviseurs et les pools de stockage.
- La topologie réseau et les règles de pare-feu.
- L'accès VPN pour les administrateurs.
- Le fournisseur d'identité, le SSO et l'intégration de la connexion sociale.
- Les accès et identifiants administrateur initiaux.

## Ce que vous contrôlez

- Le déploiement et la gestion des VM via l'interface ou l'API CloudStack ou OpenStack, ou via votre
  portail à votre image.
- Les ACL réseau et les groupes de sécurité.
- L'allocation de stockage et la gestion des volumes.
- La gestion des utilisateurs et des comptes dans CloudStack.
- Les déploiements Kubernetes, le cas échéant.

## Documentation officielle

Chaque composant dispose d'une documentation officielle complète :

| Composant         | Documentation officielle                 |
| ----------------- | ---------------------------------------- |
| Apache CloudStack | https://docs.cloudstack.apache.org       |
| OpenStack         | https://docs.openstack.org               |
| Ceph              | https://docs.ceph.com                    |
| KVM               | https://www.linux-kvm.org/page/Documents |
| Keycloak          | https://www.keycloak.org/documentation   |
| Authentik         | https://docs.goauthentik.io              |

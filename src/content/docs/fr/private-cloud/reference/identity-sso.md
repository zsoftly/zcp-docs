---
title: Identité et SSO
sidebar_position: 5
---

# Référence d'identité et SSO

ZSoftly Private Cloud prend en charge l'authentification unique (SSO) complète et la connexion
sociale. ZSoftly peut déployer Keycloak ou Authentik comme fournisseur d'identité et le connecter à
votre plateforme d'orchestration, à votre portail libre-service et aux outils de soutien. Ces deux
solutions sont recommandées; vous pouvez aussi fédérer l'accès avec un système d'identité que vous
exploitez déjà.

## Fournisseurs d'identité

| Fournisseur | Rôle                              | Documentation officielle               |
| ----------- | --------------------------------- | -------------------------------------- |
| Keycloak    | IdP libre, SSO, fédération        | https://www.keycloak.org/documentation |
| Authentik   | IdP libre, SSO, flux de connexion | https://docs.goauthentik.io            |

Les deux prennent en charge OIDC et SAML 2.0, ce qui leur permet d'agir comme intermédiaire pour les
fournisseurs ci-dessous.

## Connexion sociale et fédérée

Connectez-vous avec les fournisseurs suivants, ou fédérez l'accès avec eux :

- Google
- GitHub
- Microsoft Entra ID (Azure AD)
- Tout fournisseur d'identité OIDC ou SAML 2.0
- Votre LDAP ou Active Directory existant

## Ce que cela vous apporte

- Une seule connexion pour le portail, CloudStack ou OpenStack, et les outils de soutien.
- La connexion sociale pour les utilisateurs finaux.
- La correspondance des groupes et des rôles depuis votre fournisseur d'identité.
- L'authentification multifacteur lorsque votre fournisseur l'impose.

## Configuration

La configuration initiale du fournisseur d'identité, des realms ou tenants, et des connexions aux
fournisseurs est effectuée pendant le déploiement. Vous gérez ensuite les utilisateurs, les groupes
et les fournisseurs additionnels. L'URL et les identifiants de la console d'administration se
trouvent dans votre document de remise.

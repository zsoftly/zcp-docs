---
title: Identity & SSO
sidebar_position: 5
---

# Identity and SSO Reference

ZSoftly Private Cloud supports full single sign-on (SSO) and social login. ZSoftly can deploy
Keycloak or Authentik as the identity provider and connect it to your orchestration platform, the
self-service portal, and supporting tools. Both are recommendations; you can also federate against
an identity system you already run.

## Identity providers

| Provider  | Role                              | Official docs                          |
| --------- | --------------------------------- | -------------------------------------- |
| Keycloak  | Open-source IdP, SSO, federation  | https://www.keycloak.org/documentation |
| Authentik | Open-source IdP, SSO, login flows | https://docs.goauthentik.io            |

Both speak OIDC and SAML 2.0, so either can broker the providers below.

## Social and federated login

Sign in with, or federate against:

- Google
- GitHub
- Microsoft Entra ID (Azure AD)
- Any OIDC or SAML 2.0 identity provider
- Your existing LDAP or Active Directory

## What this gives you

- One login across the portal, CloudStack or OpenStack, and supporting tools
- Social login for end users
- Group and role mapping from your identity provider
- MFA where your provider enforces it

## Configuration

Initial identity-provider setup, realms or tenants, and provider connections are configured during
deployment. You manage users, groups, and additional providers afterward. The admin console URL and
credentials are in your handover document.

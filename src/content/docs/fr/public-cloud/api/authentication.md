---
title: Authentification
sidebar_position: 1
---

## Authentification de l'API

L'API ZSoftly Public Cloud utilise l'authentification par jeton Bearer.

**Base URL:** `https://api.zcp.zsoftly.ca/api`

:::note

Les requêtes ciblent des points de terminaison sous `/api` (par exemple `/api/regions`). Le chemin
de base lui-même (`https://api.zcp.zsoftly.ca/api`) n'a pas de route et retourne une erreur s'il est
ouvert directement.

:::

### Obtenir un jeton API

Générez un jeton Bearer dans le portail sous **Profile → API Tokens**. Il s'agit du même jeton que
celui utilisé par la [CLI `zcp`](/fr/public-cloud/cli/quickstart).

### Authentifier les requêtes

Envoyez le jeton dans l'en-tête `Authorization` de chaque requête :

```bash
curl -H "Authorization: Bearer <your-token>" \
  -H "Accept: application/json" \
  https://api.zcp.zsoftly.ca/api/regions
```

Un jeton valide retourne `200` avec une enveloppe JSON. Un jeton absent ou invalide retourne une
enveloppe d'erreur avec un statut `401` ou `403`.

### Enveloppe de réponse

Chaque point de terminaison retourne une enveloppe commune :

```json
{
  "status": "Success",
  "message": "Request processed successfully.",
  "timezone": "2026-05-31T00:00:00Z",
  "data": {}
}
```

| Champ      | Description                                |
| ---------- | ------------------------------------------ |
| `status`   | `Success` ou `Error`                       |
| `message`  | Message de résultat lisible                |
| `timezone` | Horodatage du serveur                      |
| `data`     | Charge utile de réponse (objet ou tableau) |

### Durée de vie du jeton

Les jetons émis depuis le portail restent valides jusqu'à leur révocation sous **Profile → API
Tokens**. Révoquez et régénérez tout jeton qui aurait été exposé.

Voir aussi : [Démarrage rapide de l'API](/fr/public-cloud/api/quickstart),
[Référence API](/fr/public-cloud/api/reference)

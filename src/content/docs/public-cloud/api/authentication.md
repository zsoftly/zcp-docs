---
title: Authentication
sidebar_position: 1
---

## API Authentication

The ZSoftly Public Cloud API uses Bearer token authentication.

**Base URL:** `https://api.zcp.zsoftly.ca/api`

:::note

Requests target endpoints under `/api` (for example `/api/regions`). The base path itself
(`https://api.zcp.zsoftly.ca/api`) has no route and returns an error if opened directly.

:::

### Get an API Token

Generate a Bearer token from the portal under **Profile → API Tokens**. This is the same token used
by the [`zcp` CLI](../cli/quickstart).

### Authenticate Requests

Send the token in the `Authorization` header on every request:

```bash
curl -H "Authorization: Bearer <your-token>" \
  -H "Accept: application/json" \
  https://api.zcp.zsoftly.ca/api/regions
```

A valid token returns `200` with a JSON envelope. A missing or invalid token returns an error
envelope with a `401`/`403` status.

### Response Envelope

Every endpoint returns a common envelope:

```json
{
  "status": "Success",
  "message": "Request processed successfully.",
  "timezone": "2026-05-31T00:00:00Z",
  "data": {}
}
```

| Field      | Description                                  |
| ---------- | -------------------------------------------- |
| `status`   | `Success` or `Error`                         |
| `message`  | Human-readable result message                |
| `timezone` | Server timestamp                             |
| `data`     | The response payload — an object or an array |

### Token Lifetime

Tokens issued from the portal stay valid until you revoke them under **Profile → API Tokens**.
Revoke and regenerate a token if it is ever exposed.

See also: [API Quickstart](./quickstart), [API Reference](./reference)

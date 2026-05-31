---
title: Authentication
sidebar_position: 1
---

## API Authentication

The ZSoftly Public Cloud API uses Bearer token authentication.

**Base URL:** `https://api.zcp.zsoftly.ca/api`

### Get a Bearer Token

```bash
curl -X POST https://api.zcp.zsoftly.ca/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "your-password"
  }'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2026-06-30T00:00:00Z"
}
```

### Use the Token

Include the token in the `Authorization` header of every request:

```bash
curl -H "Authorization: Bearer <your-token>" \
  https://api.zcp.zsoftly.ca/api/instances
```

### Token Lifetime

Tokens expire after a set period. Re-authenticate using the login endpoint to get a fresh token.

### Two-Factor Authentication

If 2FA is enabled on your account:

1. **Call the login endpoint**: you'll receive a partial response indicating 2FA is required.
2. Call the 2FA verification endpoint with the OTP from your email.
3. The response includes the full Bearer token.

See also: [API Quickstart](./quickstart), [API Reference](./reference)

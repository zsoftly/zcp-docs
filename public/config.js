// Default runtime config for local dev, preview, and CI. On the ZCP docs boxes,
// Caddy serves /config.js from vault-managed values and intercepts this path, so
// this file is never reached there. Blank leaves the footer status badge hidden.
window.__ZCP_ENV = {
  statusBadgeToken: '',
  clarityProjectId: '',
  redditPixelId: '',
};

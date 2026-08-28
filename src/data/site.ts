export const websiteUrl = (import.meta.env.PUBLIC_WEBSITE_URL ?? 'https://zcp.zsoftly.ca').replace(
  /\/+$/,
  ''
);

export const COMMUNITY_PAGE_URL = `${websiteUrl}/community`;

export const cloudUrl = (
  import.meta.env.PUBLIC_CLOUD_URL ?? 'https://cloud.zcp.zsoftly.ca'
).replace(/\/+$/, '');

export const CLOUD_LOGIN_URL = `${cloudUrl}/login`;
export const CLOUD_REGISTER_URL = `${cloudUrl}/register`;

export const COMMUNITY_SLACK_URL =
  'https://join.slack.com/t/zsoftlycloudp-exg5502/shared_invite/zt-469b56b2b-lG5HB2WnuntgwFG4UwfMew';

# Security Notes

This download-ready frontend is static and uses mock/free-source-ready article data. If you connect real APIs, use these rules before deployment:

1. Keep NewsAPI and Alpha Vantage keys on a backend proxy. Browser bundles are public, so frontend API keys can be copied.
2. Validate all server inputs with a schema library before calling external APIs or writing to a database.
3. Rate-limit article fetch and summarization endpoints per IP/user to reduce abuse and cost spikes.
4. Cache free API responses on the server to avoid hitting free-tier limits.
5. Use HTTPS in production and set these headers at the host/CDN: `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`.
6. Sanitize any HTML from external sources. This app currently renders source text as plain text, which is safer.
7. Do not store passwords directly. Use a trusted auth provider or password hashing with a modern algorithm such as Argon2id.
8. Rotate leaked API keys immediately and keep `.env` out of version control.
9. Run `npm audit` before deployment and after dependency updates.

No application can be guaranteed impossible to breach, but these controls reduce the common risks: exposed keys, XSS, clickjacking, data leakage, and API abuse.

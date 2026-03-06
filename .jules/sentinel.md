## 2024-03-06 - Missing Authentication on Admin APIs
**Vulnerability:** The `/api/admin/*` routes were missing authentication despite the `/admin` routes being protected. An attacker could bypass the basic authentication by directly querying the API endpoints instead of going through the admin UI pages.
**Learning:** `middleware.ts` was only checking if `pathName.startsWith('/admin')` which did not match `/api/admin`. This leaves critical admin functionality (like moderating and deleting comments) exposed without credentials.
**Prevention:** Always ensure that all permutations of sensitive routes, including UI and APIs, are correctly covered by authentication middleware. Use comprehensive matchers or a default-deny policy where appropriate.

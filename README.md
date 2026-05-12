# Kong Developer Portal Bootcamp

A hands-on bootcamp for publishing APIs on **Kong Konnect**. Covers Developer Portal setup, OIDC SSO with Keycloak, and role-based access control — all using `kongctl`.

## Modules

| Module | Topic |
|--------|-------|
| [Module 01](./module-01-developer-portal/) | Developer Portal, OIDC Auth Code Flow, RBAC & Teams |

## Labs

| Lab | Description |
|-----|-------------|
| [09-B: Developer Portal](./module-01-developer-portal/labs/09-dev-portal.md) | Publish APIs, upload OpenAPI specs, enable app registration |
| [09-C: OIDC Auth Code Flow](./module-01-developer-portal/labs/09-oidc-auth-code.md) | Browser-based SSO with Keycloak and OIDC |
| [09-D: RBAC & Teams](./module-01-developer-portal/labs/09-rbac-teams.md) | Workspaces, roles, and team isolation in Kong Manager |

## Prerequisites

| Tool | Install |
|------|---------|
| [kongctl](https://docs.konghq.com/kongctl/) | `brew install kong/kongctl/kongctl` |
| Konnect account | [cloud.konghq.com](https://cloud.konghq.com) (free tier available) |
| Konnect PAT | [Account → Tokens](https://cloud.konghq.com/global/account/tokens) |

```bash
export KONNECT_PAT="kpat_..."
kongctl login
```

## Running the Docs Site

This project uses [VitePress](https://vitepress.dev) to render the labs as a documentation site.

```bash
npm install
npm run docs:dev      # dev server at http://localhost:5173
npm run docs:build    # production build
npm run docs:preview  # preview production build
```

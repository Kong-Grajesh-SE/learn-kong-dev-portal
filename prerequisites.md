---
outline: deep
description: Everything you need installed before starting the Kong Developer Portal Bootcamp.
---

# Prerequisites

::: warning Kong Gateway Enterprise 3.14+ required
Developer Portal, OIDC, and RBAC are Enterprise features. Labs target Kong Gateway 3.14 on Konnect. Konnect free tier includes Developer Portal.
:::

## Required tools

| Tool | Purpose | Min Version | Install |
|---|---|---|---|
| **kongctl** | Konnect CLI for portal, API, and team management | Latest | `brew install kong/kongctl/kongctl` |
| **Konnect account** | Cloud control plane | - | [cloud.konghq.com](https://cloud.konghq.com) |
| **Konnect PAT** | Personal Access Token for API calls | - | Account → Tokens |
| **Kong Gateway** | The gateway itself | **3.14+** | Konnect or `kong/kong-gateway:3.14` |
| **Keycloak** | OIDC identity provider (for SSO labs) | 24+ | Docker (see below) |
| **curl** | HTTP client | Any | Pre-installed on macOS/Linux |
| **jq** | Parse JSON responses | 1.6+ | `brew install jq` |
| **Node.js** | Run the docs site locally | 20 LTS | `brew install node@20` |

## Verify your setup

```bash
# kongctl
kongctl version

# Konnect login
export KONNECT_PAT="kpat_your_token_here"
kongctl login
kongctl whoami

# Kong Gateway
curl -s http://localhost:8001/status | jq '.server.connections_active'

# jq
jq --version
```

## Konnect setup

1. Sign up at [cloud.konghq.com](https://cloud.konghq.com) (free tier works)
2. Create a Personal Access Token (PAT): **Account** → **Tokens** → **Generate Token**
3. Export the token:

```bash
export KONNECT_PAT="kpat_your_token_here"
kongctl login
```

## Keycloak setup (for OIDC labs)

The OIDC lab requires Keycloak running locally:

```bash
# Start Keycloak with the workshop realm
docker run -d --name keycloak \
  -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:24.0 start-dev

# Verify Keycloak is running
curl -s http://localhost:8080/realms/master | jq '.realm'
# "master"
```

---

*Ready? Start with [Module 01 - Developer Portal →](/module-01-developer-portal/)*

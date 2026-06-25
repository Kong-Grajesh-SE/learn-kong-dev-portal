---
outline: deep
description: Everything you need before starting the Kong Developer Portal Bootcamp.
---

# Prerequisites

::: tip Continues from earlier bootcamps
This bootcamp assumes you've completed the API Gateway and APIOps bootcamps and have gateway services running on a Konnect control plane.
:::

## Required tools

| Tool | Purpose | Install |
|---|---|---|
| **Konnect account** | Cloud control plane with Dev Portal | [cloud.konghq.com](https://cloud.konghq.com) (free tier) |
| **Konnect PAT** | Personal Access Token for REST API calls | Account → Tokens |
| **curl** | HTTP client for Konnect REST API | Pre-installed on macOS/Linux |
| **jq** | Parse JSON responses | `brew install jq` |
| **Node.js** | Run the docs site locally | `brew install node@20` |

## Prior bootcamp services

Your Konnect control plane should have these services from the API Gateway bootcamp:

| Service | Route | Purpose |
|---|---|---|
| `bookstore-service` | `/api/bookstore` | Flight search and booking |
| `inventory-service` | `/api/hotels` | Hotel search |
| `payments-service` | `/api/cars` | Car rental search |

If you don't have these services, complete the [API Gateway Bootcamp](https://kong-grajesh-se.github.io/learn-kong-gateway/) first, or create placeholder services in your control plane.

## Verify your setup

```bash
# Set environment variables
export KONNECT_PAT="kpat_your_token_here"
export KONNECT_API="https://us.api.konghq.com"

# Verify Konnect access
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/me" | jq '{name: .full_name, org: .active_org.name}'

# Verify jq
jq --version

# Verify control plane has services
CP_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/control-planes" | jq -r '.data[0].id')
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/control-planes/$CP_ID/core-entities/services" | \
  jq '.data[] | {name, host}'
```

You should see your gateway services listed. If the Konnect API returns `401`, your PAT may be expired - generate a new one.

::: info US vs EU region
These labs use `us.api.konghq.com`. If your Konnect org is in the EU region, replace with `eu.api.konghq.com`.
:::

---

*Ready? Start with [Module 01 - Developer Portal →](/module-01-portal-setup/)*

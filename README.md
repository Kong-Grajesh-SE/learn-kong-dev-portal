# Kong Developer Portal Bootcamp

![Kong Gateway 3.14+](https://img.shields.io/badge/Kong%20Gateway-3.14%2B-CCFF00?style=for-the-badge&labelColor=001408)
![Platform: Konnect](https://img.shields.io/badge/Platform-Konnect-CCFF00?style=for-the-badge&labelColor=001408)
![Modules: 3](https://img.shields.io/badge/Modules-3-CCFF00?style=for-the-badge&labelColor=001408)

> **Continues from the APIOps bootcamp.** You've built gateway services and managed config with decK. Now expose those APIs to external developers.

A hands-on bootcamp for publishing APIs on **Kong Konnect Developer Portal**. Create a self-service portal, configure auth strategies, and set up team-based access control - all using the Konnect UI and REST API.

![Bootcamp Recap](./public/bootcamp_recap.png)

## Overview

| | |
|---|---|
| **Platform** | **Kong Konnect** (free tier includes Dev Portal) |
| **Format** | 3 modules, 3 labs (~3 hours) |
| **Flow** | Portal Setup → App Registration → Customization & Teams |
| **Tools** | Konnect UI + Konnect REST API (curl) |

## Modules

| # | Module | Key Topics |
|---|---|---|
| 01 | [Portal Setup & API Publishing](./module-01-portal-setup/) | API products, OpenAPI specs, versions, implementations, publications |
| 02 | [App Registration & Auth](./module-02-app-registration/) | Key-auth strategy, developer self-service, the developer experience |
| 03 | [Portal Customization & Teams](./module-03-portal-customization/) | Theme, pages, snippets, visibility, teams, RBAC, SSO |

## Prerequisites

| Tool | Install |
|------|---------|
| Konnect account | [cloud.konghq.com](https://cloud.konghq.com) (free tier) |
| Konnect PAT | [Account → Tokens](https://cloud.konghq.com/global/account/tokens) |
| curl + jq | Pre-installed on macOS; `brew install jq` if needed |
| Prior bootcamp services | `bookstore-service`, `inventory-service`, `payments-service` on your control plane |

```bash
export KONNECT_PAT="kpat_..."
export KONNECT_API="https://us.api.konghq.com"
curl -s -H "Authorization: Bearer $KONNECT_PAT" "$KONNECT_API/v2/me" | jq '.full_name'
```

## Quick Start

```bash
npm install
npm run docs:dev      # dev server at http://localhost:5173
npm run docs:build    # production build
```

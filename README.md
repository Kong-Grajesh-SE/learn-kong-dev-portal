# Kong Developer Portal Bootcamp

![Kong Gateway 3.14+](https://img.shields.io/badge/Kong%20Gateway-3.14%2B-CCFF00?style=for-the-badge&labelColor=001408)
![Platform: Konnect](https://img.shields.io/badge/Platform-Konnect-CCFF00?style=for-the-badge&labelColor=001408)
![Modules: 1](https://img.shields.io/badge/Modules-1-CCFF00?style=for-the-badge&labelColor=001408)

> **Continues from the APIOps bootcamp.** You've built gateway services and managed config with decK. Now expose those APIs to external developers.

A hands-on bootcamp for publishing APIs on **Kong Konnect Developer Portal**. Create a self-service portal, configure auth strategies, and set up team-based access control - all using the Konnect UI and REST API.

## Overview

| | |
|---|---|
| **Platform** | **Kong Konnect** (free tier includes Dev Portal) |
| **Format** | 1 module, 3 labs (~3 hours) |
| **Flow** | Portal Setup → App Registration → Customization & Teams |
| **Tools** | Konnect UI + Konnect REST API (curl) |

## Module

| # | Module | Key Topics |
|---|---|---|
| 01 | **Developer Portal** | API products, OpenAPI specs, auth strategies, app registration, pages, teams, SSO |

## Labs

| Lab | Topic |
|---|---|
| [01 - Portal Setup & API Publishing](./module-01-developer-portal/labs/01-portal-setup.md) | Create portal, API products, versions, implementations, publications |
| [02 - App Registration & Auth Strategies](./module-01-developer-portal/labs/02-app-registration.md) | Key-auth strategy, developer self-service, the developer experience |
| [03 - Portal Customization & Teams](./module-01-developer-portal/labs/03-portal-customization.md) | Theme, pages, snippets, visibility, teams, RBAC, SSO |

## Prerequisites

| Tool | Install |
|------|---------|
| Konnect account | [cloud.konghq.com](https://cloud.konghq.com) (free tier) |
| Konnect PAT | [Account → Tokens](https://cloud.konghq.com/global/account/tokens) |
| curl + jq | Pre-installed on macOS; `brew install jq` if needed |
| Prior bootcamp services | `flights-svc`, `hotels-svc`, `cars-svc` on your control plane |

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

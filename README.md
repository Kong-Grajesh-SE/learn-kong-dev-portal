# Kong Developer Portal Bootcamp

![Kong Gateway 3.14+](https://img.shields.io/badge/Kong%20Gateway-3.14%2B-CCFF00?style=for-the-badge&labelColor=001408)
![Platform: Konnect](https://img.shields.io/badge/Platform-Konnect-CCFF00?style=for-the-badge&labelColor=001408)
![Modules: 1](https://img.shields.io/badge/Modules-1-CCFF00?style=for-the-badge&labelColor=001408)

> ⚙️ **Requires Kong Gateway Enterprise 3.14+** or Konnect free tier.

A hands-on bootcamp for publishing APIs on **Kong Konnect**. Covers Developer Portal setup, OIDC SSO with Keycloak, and role-based access control.

## Overview

| | |
|---|---|
| **Kong version** | **Kong Gateway Enterprise 3.14+** |
| **Format** | 1 module, 3 labs (~2.5 hours) |
| **Flow** | OIDC Auth Code → Developer Portal → RBAC & Teams |
| **Platform** | kongctl + Keycloak → Kong Konnect |

## Bootcamp Modules

| # | Module | Key Topics |
|---|---|---|
| 01 | **Developer Portal** | OIDC SSO, API publishing, OpenAPI specs, RBAC workspaces, consumer groups |

## Modules

| Module | Topic |
|---|---|
| [Module 01 - Developer Portal](./module-01-developer-portal/) | OIDC Auth Code Flow, Developer Portal, RBAC & Teams |

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

## Quick Start

```bash
npm install
npm run docs:dev      # dev server at http://localhost:5173
npm run docs:build    # production build
```

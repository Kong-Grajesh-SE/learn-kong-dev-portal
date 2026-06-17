---
title: Lab Resources
description: Downloadable OpenAPI specs, decK files, portal pages, and docs for Developer Portal labs.
---

# Lab Resources

::: tip Download and use alongside the labs
These are the actual configuration files used in the bootcamp labs. Download the ones you need or clone the full `resources/` folder to follow along.
:::

## OpenAPI Specs

| File | Description |
|---|---|
| [bookstore-api.yaml](resources/openapi/bookstore-api.yaml) | Bookstore API v1 - upload to Developer Portal |
| [bookstore-api-v2.yaml](resources/openapi/bookstore-api-v2.yaml) | Bookstore API v2 - for version management labs |

---

## decK Configuration Files

| File | Description |
|---|---|
| [plugin-cors.yaml](resources/deck/plugin-cors.yaml) | CORS plugin template (required for portal "Try It") |
| [generated-kong.yaml](resources/deck/generated-kong.yaml) | Generated Kong config from openapi2kong |
| [bookstore-final.yaml](resources/deck/bookstore-final.yaml) | Final config with CORS applied |

### Generate and deploy

```bash
# Convert OpenAPI to Kong config
deck file openapi2kong \
  --spec resources/openapi/bookstore-api.yaml \
  --output-file resources/deck/generated-kong.yaml

# Patch for httpbun compatibility
deck file patch \
  --selector '$..services[*]' \
  --value 'path:"/anything"' \
  -s resources/deck/generated-kong.yaml \
  --output-file resources/deck/generated-kong.yaml

# Add CORS plugin
deck file add-plugins \
  -s resources/deck/generated-kong.yaml \
  resources/deck/plugin-cors.yaml \
  --output-file resources/deck/bookstore-final.yaml

# Deploy
deck gateway sync resources/deck/bookstore-final.yaml \
  --konnect-token $KONNECT_TOKEN \
  --konnect-control-plane-name "$CP_NAME"
```

---

## Portal Pages

These Markdown files are uploaded as portal pages via the Konnect API.

| File | Purpose |
|---|---|
| [getting-started.md](resources/pages/getting-started.md) | Getting started guide for portal visitors |
| [terms-of-service.md](resources/pages/terms-of-service.md) | Terms of service page |
| [changelog.md](resources/pages/changelog.md) | API changelog page |

---

## API Documentation

| File | Purpose |
|---|---|
| [books-quickstart.md](resources/docs/books-quickstart.md) | Quick Start guide attached to the API product |

---

## Architecture Diagrams

| File | Description |
|---|---|
| [api_portal_end_to_end_flow.png](resources/assets/api_portal_end_to_end_flow.png) | End-to-end portal flow |
| [api_portal_flow.png](resources/assets/api_portal_flow.png) | Portal architecture |

---

## Source

These resources are sourced from the [Kong Bootcamp Repo](https://github.com/Kong-Grajesh-SE/bootcamp-repo/tree/main/03-api-portal).

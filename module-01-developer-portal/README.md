# Module 01 - Developer Portal

> **The scenario.** Your mytravel.com APIs are live behind Kong Gateway. You've built services, applied plugins, and managed config declaratively with decK. But external partners and third-party developers have no way to discover, subscribe to, or test your APIs. You need a **self-service developer portal**.
>
> In the next ~3 hours you'll create a Developer Portal on Konnect, publish your APIs with OpenAPI specs, configure authentication strategies for app registration, and customise the portal with pages, teams, and branding.

## What you'll have at the end

- A live Developer Portal on Konnect with your travel APIs published
- Interactive OpenAPI documentation with "Try It" functionality
- Key-auth authentication strategy with developer self-service registration
- Portal pages (Getting Started guide, Terms of Service, Changelog)
- Team-based access control with public and private API visibility
- SSO identity provider configuration (OIDC/SAML)

## Who this module is for

You've completed the earlier bootcamps (API Gateway, AI Gateway, Agentic, APIOps) and have services running on a Konnect control plane. You have a Konnect account and a Personal Access Token (PAT).

```bash
# Verify Konnect access
export KONNECT_PAT="kpat_..."
export KONNECT_API="https://us.api.konghq.com"

curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/me" | jq '{name: .full_name, org: .active_org.name}'
```

## Three concepts you need today

| Concept | What it is | Why it matters |
|---|---|---|
| **API Product** | A catalog entry in Konnect with versions, specs, and implementations | The bridge between your running gateway service and what developers see in the portal |
| **Auth Strategy** | How developer applications prove their identity (key-auth or OIDC) | Controls credential issuance - developers get API keys or OAuth tokens through the portal |
| **Portal Teams** | Groups of developers with shared visibility and access rules | Partners see private APIs, public developers don't - without managing individual permissions |

## Pre-reads

Read these before starting the labs (~20 min total):

| # | Topic | What you'll learn |
|---|---|---|
| [01: What is Developer Portal?](./01-what-is-dev-portal) | The product, its architecture, key objects (API Product, Version, Implementation, Publication, Auth Strategy), and where it fits in the API lifecycle |
| [02: Teams and Roles](./02-teams-and-roles) | Two layers of access control - Konnect org teams (who manages the portal) vs portal developer teams (who sees which APIs) |

---

## Labs

| Lab | Topic | Time |
|---|---|---|
| [01: Portal Setup & API Publishing](./labs/01-portal-setup) | Create portal, API products, versions with OpenAPI specs, implementations, publications | ~70 min |
| [02: App Registration & Auth Strategies](./labs/02-app-registration) | Key-auth strategy, developer self-service, walk through the developer experience | ~60 min |
| [03: Portal Customization & Teams](./labs/03-portal-customization) | Theme, pages, snippets, API documents, visibility, teams, RBAC, SSO | ~65 min |

## Exit ticket

1. What is the relationship chain from API Product → Version → Implementation → Publication?
2. Why does Konnect separate "API Products" from "Gateway Services" instead of publishing services directly?
3. A partner should see an API that public developers cannot. What two objects do you configure?
4. What is the difference between `auto_approve_developers` and `auto_approve_applications`?

## Common pitfalls

| Symptom | Likely cause |
|---|---|
| API doesn't appear on portal | Missing **publication** - the API product exists but isn't published to the portal |
| "Try It" returns errors | Missing **implementation** - the API isn't linked to a gateway service |
| Developer can't get credentials | No **auth strategy** attached to the publication |
| Private API visible to everyone | RBAC not enabled on the portal, or visibility set to `public` |
| `401` from Konnect API | PAT expired or wrong geo URL - check `us.api.konghq.com` vs `eu.api.konghq.com` |
| Spec not rendering | Invalid OpenAPI - validate with `deck file validate` from the APIOps bootcamp |

## Resources

- [Konnect Dev Portal docs](https://developer.konghq.com/dev-portal/)
- [Konnect API reference](https://developer.konghq.com/api/konnect/portal-management/v3/)
- [Dev Portal breaking changes (v3)](https://developer.konghq.com/dev-portal/breaking-changes/)
- [Auth strategies](https://developer.konghq.com/dev-portal/auth-strategies/)
- [Developer RBAC](https://developer.konghq.com/dev-portal/developer-rbac/)

---

*[← Home](/) · End of Developer Portal Bootcamp*

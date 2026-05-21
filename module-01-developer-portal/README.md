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

## Pre-read: Dev Portal Teams and Roles

Before jumping into the labs, understand the **two layers** of team-based access control in Konnect:

### Layer 1 — Konnect Organization Teams (who manages the portal)

These teams control which **Konnect users** (your internal team) can administer the portal, publish APIs, and approve registrations. Assign them under **Organization → Teams** in Konnect.

#### Predefined teams

| Team | What members can do |
|---|---|
| **Organization Admin** | Full access to all Konnect resources including Dev Portal |
| **Portal Admin** | Full management of Dev Portal content, configuration, developer/application approvals, and service connections |
| **API Product Admin** | Create and manage API products, publish versions to Dev Portal, enable app registration |

#### Predefined Dev Portal roles

You can also create **custom teams** and assign granular roles. The Dev Portal roles are:

| Role | Permissions |
|---|---|
| **Admin** | Full write access — manage developers, applications, teams, publish APIs, grant access, delete portal |
| **Creator** | Create new Dev Portals |
| **Maintainer** | Edit/delete applications, view developers, publish APIs, grant access (cannot delete portal) |
| **Viewer** | Read-only access to developers and applications |
| **Content Editor** | Edit portal pages, snippets, and customization |
| **Product Publisher** | Publish API products to the portal |
| **API Registration Approver** | Approve developer application registration requests |

#### Custom teams for common personas

Kong recommends these custom team configurations for typical organizations:

| Custom Team | Purpose | Key Roles |
|---|---|---|
| **API Platform Owner** | Full access to APIs, portals, and applications | Portal Creator, Portal Admin, API Creator, API Admin, API Publisher |
| **Portal Owner** | Configure a specific portal, manage applications | Portal Admin (scoped), Auth Strategy Viewer, API Publisher |
| **API Owner** | Define, publish, and approve registrations for specific APIs | API Admin, API Publisher, API Approver, Portal Viewer |
| **API Security Owner** | Manage auth strategies (key-auth, OIDC, DCR) | Auth Strategy Creator, Auth Strategy Maintainer, DCR Provider Creator |
| **Portal Content Editor** | Manage portal pages and snippets | Portal Content Editor (scoped) |

::: tip Role scoping
Most roles can be scoped to a specific resource. For example, you can make someone a Portal Admin for only the staging portal, or an API Owner for only the Flights API. This enables **least-privilege access** across teams.
:::

### Layer 2 — Dev Portal Developer Teams (who sees which APIs)

These teams control which **external developers** (your API consumers) can see and register for specific APIs on the portal. Manage them under **Dev Portal → Access and Approvals → Teams**.

| Developer Role | What it grants |
|---|---|
| **API Consumer** | Developer can make API calls to the selected APIs |
| **API Viewer** | Read-only access to the API documentation (no registration) |

**How it works:**

1. Enable **RBAC** on the portal (Settings → Security)
2. Create developer teams (e.g., `travel-partners`, `public-developers`)
3. Assign API roles to each team (which APIs, Consumer vs Viewer)
4. Add developers to teams — manually, or automatically via IdP group mapping

```
Konnect Organization
├── Org Teams (internal staff)           ← Layer 1
│   ├── Portal Admin team
│   ├── API Owner team
│   └── Content Editor team
│
└── Dev Portal
    └── Developer Teams (API consumers)  ← Layer 2
        ├── travel-partners → Cars API (Consumer), Hotels API (Consumer)
        └── public-developers → Flights API (Consumer)
```

::: info Two different kinds of "teams"
**Konnect org teams** = your internal staff who *manage* the portal (Layer 1).
**Dev Portal developer teams** = external developers who *use* the portal (Layer 2).
Don't confuse them — they live in different parts of the Konnect UI.
:::

### When to use which

| Scenario | Layer | Action |
|---|---|---|
| "Alice should be able to publish APIs to the portal" | Layer 1 | Add Alice to a Konnect team with API Publisher role |
| "Bob (external dev) should see the Cars API" | Layer 2 | Add Bob to a portal developer team with Consumer role on Cars API |
| "Only the security team can manage auth strategies" | Layer 1 | Create a custom team with Auth Strategy Maintainer role |
| "Partners see private APIs, public devs don't" | Layer 2 | Set API visibility to private, grant access via developer team |

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

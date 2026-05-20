# Module 01 - Developer Portal

> **The scenario.** Your mytravel.com APIs are live behind Kong Gateway. Internal teams can hit the Admin API, but external partners and third-party developers have no way to discover, subscribe to, or test your APIs. You need a self-service portal - with real identity, team isolation, and role-based access.
>
> In the next ~2.5 hours you'll publish APIs to Kong's Developer Portal, secure them with OIDC Authorization Code Flow via Keycloak, and lock down Kong Manager with RBAC so each team manages only their own services.

## What you'll have at the end

- A published Developer Portal with OpenAPI specs, app registration, and team-based visibility
- OIDC Authorization Code Flow with Keycloak for browser-based SSO
- Kong Manager RBAC with workspaces, roles, and consumer group tiers
- A complete enterprise identity and governance layer on top of your gateway

## Who this module is for

You have Kong Gateway 3.14+ running (Konnect or self-hosted Enterprise). You have `kongctl` installed and a Konnect PAT configured.

```bash
# Confirm kongctl is available
kongctl version
```

::: warning Requires Kong Gateway Enterprise
Developer Portal, OIDC, and RBAC are Enterprise features. Konnect free tier includes Developer Portal.
:::

## Three concepts you need today

| Concept | What it is | Why it matters |
|---|---|---|
| **Developer Portal** | A managed API catalog where external developers discover, subscribe to, and test your APIs | Eliminates the "email the platform team" bottleneck - developers self-serve |
| **OIDC Auth Code Flow** | Browser-based SSO: redirect to IdP → login → auth code → token exchange → session cookie | Real identity on every request - no shared API keys for human users |
| **RBAC Workspaces** | Kong Manager isolation boundaries - each team sees only their own services, routes, plugins | Prevents the "flights team accidentally deletes the AI team's routes" problem |

## Labs

| Lab | Topic | Time |
|---|---|---|
| [01-A: OIDC Auth Code Flow](/module-01-developer-portal/labs/01-oidc-auth-code) | Full browser-based SSO with Keycloak | ~45 min |
| [01-B: Developer Portal](/module-01-developer-portal/labs/01-dev-portal) | Publish APIs, manage teams, customise portal | ~60 min |
| [01-C: RBAC & Teams](/module-01-developer-portal/labs/01-rbac-teams) | Kong Manager RBAC, consumer groups, team isolation | ~45 min |

## Exit ticket

1. What is the difference between `authorization_code` and `session` in the OIDC plugin's `auth_methods`?
2. Why does the Developer Portal require an API Product → Version → Spec chain instead of directly attaching a spec to a service?
3. A new team joins the organization. What three Kong objects do you create to give them isolated access?

## Common pitfalls

| Symptom | Likely cause |
|---|---|
| OIDC redirect loop after Keycloak login | `redirect_uri` in Kong plugin doesn't match URI registered in Keycloak client - must be exact |
| `403` when accessing another workspace | RBAC working correctly - user has no role in that workspace |
| Portal shows "No APIs available" | API product not published to the portal, or no spec uploaded |
| Session cookie not set after login | `session_secret` is missing or too short (needs 32+ chars) |
| `kongctl` commands fail with 401 | PAT expired or not exported - re-export `KONNECT_PAT` |

## Resources

- [Kong Konnect](https://cloud.konghq.com/)
- [Developer Portal docs](https://developer.konghq.com/dev-portal/)
- [Kong RBAC](https://developer.konghq.com/gateway/kong-manager/rbac/)

---

*[← Home](/) · End of Developer Portal Bootcamp*

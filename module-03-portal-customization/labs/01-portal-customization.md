# Lab 03 - Portal Customization & Teams

> **Goal:** Customize the portal's appearance, add documentation pages, configure SSO identity providers, and set up team-based access control for developers.
>
> Every step has a **Checkpoint** - if the expected output doesn't match, stop and fix before continuing.

## Prerequisites

- Labs 01 and 02 completed (portal with published APIs and auth strategy)
- Environment variables still set: `KONNECT_PAT`, `KONNECT_API`, `PORTAL_ID`

```bash
# Verify portal
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID" | jq '{name, default_domain}'
```

---

## The story continues

Your portal is functional - developers can find APIs and register for access. But it looks generic. Your product team wants:
1. **Branded appearance** - match the mytravel.com look and feel
2. **Getting-started guides** - help developers onboard faster
3. **Team-based access** - partners see different APIs than internal developers
4. **SSO** - developers log in with their existing corporate identity

---

## Step 1 - Customize Portal Appearance (~15 min)

### Via Konnect UI

1. Navigate to **Dev Portal** → your portal → **Settings** → **Appearance**
2. Update:
   - **Theme Mode:** Dark
   - **Primary Color:** `#001408` (Kong dark green)
3. Upload a logo (any PNG/SVG)
4. Click **Save**

### Via API

```bash
curl -s -X PUT "$KONNECT_API/v3/portals/$PORTAL_ID/customization" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": {
      "name": "custom",
      "mode": "dark",
      "colors": {
        "primary": "#00E88F"
      }
    },
    "spec_renderer": {
      "try_it_ui": true,
      "try_it_insomnia": true,
      "show_schemas": true,
      "infinite_scroll": false,
      "hide_internal": true,
      "hide_deprecated": true,
      "allow_custom_server_urls": false
    }
  }' | jq '{theme, spec_renderer}'
```

### Read back the customization

```bash
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID/customization" | \
  jq '{theme: .theme.mode, primary_color: .theme.colors.primary, try_it: .spec_renderer.try_it_ui}'
```

**Checkpoint.** The customization response shows your theme mode and primary color.

::: tip Spec renderer options explained
| Option | What it does |
|---|---|
| `try_it_ui` | Shows the "Try It" panel for making live requests |
| `try_it_insomnia` | Shows "Open in Insomnia" button |
| `show_schemas` | Displays component schemas in the spec |
| `hide_internal` | Hides operations marked `x-internal: true` |
| `hide_deprecated` | Hides deprecated operations |
| `allow_custom_server_urls` | Lets developers override the base URL in "Try It" |
:::

---

## Step 2 - Add Documentation Pages (~15 min)

Portal **Pages** are Markdown documents that appear alongside your API catalog. Use them for getting-started guides, terms of service, changelogs, or tutorials.

### 2a. Create a Getting Started page

```bash
curl -s -X POST "$KONNECT_API/v3/portals/$PORTAL_ID/pages" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started",
    "slug": "getting-started",
    "visibility": "public",
    "status": "published",
    "content": "# Getting Started with mytravel.com APIs\n\nWelcome to the mytravel.com Developer Portal. This guide walks you through getting your first API key and making your first request.\n\n## Step 1: Create an Account\n\nClick **Sign Up** in the top-right corner and fill in your details.\n\n## Step 2: Create an Application\n\nOnce registered, go to **My Apps** and create a new application. Give it a name that describes your integration.\n\n## Step 3: Register for an API\n\nBrowse the API catalog and click **Register** on any API you want to use. Select your application and you will receive an API key.\n\n## Step 4: Make Your First Request\n\n```bash\ncurl -H \"apikey: YOUR_API_KEY\" https://api.mytravel.com/api/flights\n```\n\nThat is it! You are now connected to the mytravel.com platform.\n\n## Rate Limits\n\n| Tier | Requests/min | Description |\n|---|---|---|\n| Free | 100 | Default for all new apps |\n| Professional | 1,000 | Contact sales to upgrade |\n| Enterprise | 10,000 | Custom SLA |\n\n## Support\n\nFor API support, email api-support@mytravel.com or visit our support portal."
  }' | jq '{id, title, slug, status}'
```

### 2b. Create a Terms of Service page

```bash
curl -s -X POST "$KONNECT_API/v3/portals/$PORTAL_ID/pages" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Terms of Service",
    "slug": "terms-of-service",
    "visibility": "public",
    "status": "published",
    "content": "# Terms of Service\n\n**Effective Date:** January 1, 2026\n\nBy accessing the mytravel.com APIs, you agree to the following terms:\n\n## Acceptable Use\n\n- Use the APIs only for their intended purpose\n- Do not exceed your rate limit tier\n- Do not share API keys across applications\n- Do not scrape or cache bulk data without authorization\n\n## Data Privacy\n\nAll personal data transmitted through our APIs is subject to our Privacy Policy. You are responsible for handling user data in compliance with applicable regulations (GDPR, CCPA, etc.).\n\n## SLA\n\nWe target 99.9% uptime for production API endpoints. Scheduled maintenance windows are announced 72 hours in advance.\n\n## Changes\n\nWe may update these terms at any time. Continued use after changes constitutes acceptance."
  }' | jq '{id, title, slug, status}'
```

### 2c. Create an API Changelog page

```bash
curl -s -X POST "$KONNECT_API/v3/portals/$PORTAL_ID/pages" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Changelog",
    "slug": "changelog",
    "visibility": "public",
    "status": "published",
    "content": "# API Changelog\n\n## 2026-05-01 - Flights API v1.0.0\n\n- Initial release\n- Endpoints: GET /api/flights, GET /api/flights/{id}, POST /api/bookings\n- Authentication: API key in `apikey` header\n\n## 2026-05-01 - Hotels API v1.0.0\n\n- Initial release\n- Endpoints: GET /api/hotels, GET /api/hotels/{id}\n\n## 2026-05-01 - Cars API v1.0.0\n\n- Initial release\n- Endpoints: GET /api/cars\n- Filter by airport code and pickup date"
  }' | jq '{id, title, slug, status}'
```

### 2d. List all pages

```bash
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID/pages" | \
  jq '.data[] | {title, slug, status, visibility}'
```

**Checkpoint.** Three pages listed: Getting Started, Terms of Service, and Changelog. All with `status: "published"`.

---

## Step 3 - Add API-Level Documentation (~10 min)

API **Documents** are Markdown pages attached to a specific API product (not the portal). They appear alongside the API's spec - use them for integration guides, authentication tutorials, or SDK references.

```bash
# Add a "Quick Start" document to the Flights API
curl -s -X POST "$KONNECT_API/v3/apis/$FLIGHTS_API_ID/documents" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Flights API Quick Start",
    "slug": "quick-start",
    "status": "published",
    "content": "# Flights API Quick Start\n\n## Search Flights\n\nFind flights between two airports on a specific date:\n\n```bash\ncurl -H \"apikey: YOUR_KEY\" \\\n  \"https://api.mytravel.com/api/flights?origin=LHR&destination=JFK&date=2026-07-15\"\n```\n\n## Book a Flight\n\nOnce you have found a flight, book it:\n\n```bash\ncurl -X POST -H \"apikey: YOUR_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d \"{\\\"flight_id\\\": 42, \\\"passenger_name\\\": \\\"Jane Doe\\\", \\\"seats\\\": 2}\" \\\n  https://api.mytravel.com/api/bookings\n```\n\n## Error Handling\n\n| Status | Meaning |\n|---|---|\n| 200 | Success |\n| 401 | Missing or invalid API key |\n| 404 | Flight not found |\n| 429 | Rate limit exceeded - check Retry-After header |"
  }' | jq '{id, title, slug}'
```

**Checkpoint.** Document created. In the portal, navigate to Flights API and you'll see "Quick Start" as a documentation tab alongside the spec.

---

## Step 4 - Configure API Visibility (~10 min)

Control which APIs are visible to which developers using **visibility** settings.

### 4a. Understand visibility options

| Visibility | Who can see it |
|---|---|
| **Public** | Anyone browsing the portal (even unauthenticated) |
| **Private** | Only authenticated developers who are granted access through teams |

### 4b. Make an API private

Let's make the Cars API private - only certain partners should see it:

```bash
# Get the Cars API publication ID
CARS_PUB_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/apis/$CARS_API_ID/publications" | jq -r '.data[0].id')

# Update visibility to private
curl -s -X PATCH "$KONNECT_API/v3/apis/$CARS_API_ID/publications/$CARS_PUB_ID" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{"visibility": "private"}' | jq '{id, visibility}'
```

**Checkpoint.** Open the portal in an incognito window (unauthenticated). You should see Flights and Hotels but NOT Cars. Log in as a developer and you still won't see Cars until you're added to a team with access (next step).

---

## Step 5 - Set Up Developer Teams & RBAC (~15 min)

Portal **Teams** control which developers can see which APIs. This is how you implement partner tiers, internal vs external access, or geographic restrictions.

### 5a. Enable RBAC on the portal

```bash
curl -s -X PATCH "$KONNECT_API/v3/portals/$PORTAL_ID" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{"rbac_enabled": true}' | jq '{name, rbac_enabled}'
```

### 5b. Create teams

```bash
# Partners team - gets access to all APIs including private ones
curl -s -X POST "$KONNECT_API/v3/portals/$PORTAL_ID/teams" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "travel-partners",
    "description": "Approved travel agency partners with access to all APIs including car rentals"
  }' | jq '{id, name}'

# Public developers team - gets access to public APIs only
curl -s -X POST "$KONNECT_API/v3/portals/$PORTAL_ID/teams" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "public-developers",
    "description": "General developers with access to public flight and hotel APIs"
  }' | jq '{id, name}'
```

### 5c. List teams

```bash
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID/teams" | \
  jq '.data[] | {id, name, description}'
```

**Checkpoint.** Two teams created: `travel-partners` and `public-developers`.

### 5d. Assign API access to teams

Teams control visibility of private APIs. For the Cars API (which you made private in Step 4), grant access to the `travel-partners` team via the Konnect UI:

1. Navigate to **Dev Portal** → your portal → **Teams**
2. Click **travel-partners**
3. Under **Roles**, add a role that grants access to the Cars API
4. Developers in this team will now see the private Cars API

::: info Team assignment
Adding developers to teams is done through the Konnect UI or by mapping from your identity provider (see Step 6). When a developer signs up, an admin assigns them to the appropriate team.
:::

---

## Step 6 - Configure SSO Identity Provider (~15 min)

In production, you don't want developers creating portal-specific passwords. Configure an **identity provider** so developers log in with their existing corporate credentials.

### 6a. OIDC Provider (Okta, Auth0, Azure AD, Keycloak)

```bash
curl -s -X POST "$KONNECT_API/v3/portals/$PORTAL_ID/identity-providers" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "oidc",
    "enabled": true,
    "config": {
      "issuer_url": "https://your-idp.example.com/.well-known/openid-configuration",
      "client_id": "your-portal-client-id",
      "client_secret": "your-portal-client-secret",
      "scopes": ["openid", "profile", "email"],
      "claim_mappings": {
        "name": "name",
        "email": "email",
        "groups": "groups"
      }
    }
  }' | jq '{id, type, enabled}'
```

::: warning Replace placeholder values
The `issuer_url`, `client_id`, and `client_secret` above are placeholders. Replace them with your actual IdP configuration. If you don't have an IdP set up, skip this step - basic auth still works.
:::

### 6b. SAML Provider

For SAML-based IdPs:

```bash
curl -s -X POST "$KONNECT_API/v3/portals/$PORTAL_ID/identity-providers" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "saml",
    "enabled": true,
    "config": {
      "idp_metadata_url": "https://your-idp.example.com/metadata"
    }
  }' | jq '{id, type, enabled}'
```

### 6c. Configure auth settings

Control which login methods are available:

```bash
# Check current auth settings
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID/authentication-settings" | \
  jq '{basic_auth_enabled, konnect_mapping_enabled, idp_mapping_enabled}'
```

| Setting | Purpose |
|---|---|
| `basic_auth_enabled` | Allow email/password login |
| `konnect_mapping_enabled` | Map Konnect organization users to portal developers |
| `idp_mapping_enabled` | Map IdP groups to portal teams automatically |

### 6d. IdP Team Mapping

When `idp_mapping_enabled` is `true`, you can map IdP groups to portal teams. Developers who belong to the `travel-agents` group in your IdP are automatically added to the `travel-partners` portal team.

Configure team mappings in the Konnect UI:
1. **Dev Portal** → your portal → **Settings** → **Team Mappings**
2. Map IdP group `travel-agents` → portal team `travel-partners`
3. Map IdP group `developers` → portal team `public-developers`

---

## Step 7 - Portal Snippets (~5 min)

**Snippets** are reusable content blocks that appear in specific locations on the portal (headers, footers, banners). They support Markdown.

```bash
# Create a support contact snippet
curl -s -X POST "$KONNECT_API/v3/portals/$PORTAL_ID/snippets" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "support-banner",
    "title": "Need Help?",
    "visibility": "public",
    "status": "published",
    "content": "Having trouble? Reach out to our API support team at **api-support@mytravel.com** or join our [Slack community](https://mytravel-dev.slack.com)."
  }' | jq '{id, name, status}'
```

**Checkpoint.** Snippet created. List all snippets:

```bash
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID/snippets" | \
  jq '.data[] | {name, title, status}'
```

---

## Step 8 - Review the Complete Portal (~5 min)

Take a final tour of everything you've built:

```bash
# Portal summary
echo "=== Portal ==="
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID" | \
  jq '{name, default_domain, authentication_enabled, rbac_enabled, auto_approve_developers}'

echo -e "\n=== Published APIs ==="
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID" | jq -r '.default_domain'
for api_id in $FLIGHTS_API_ID $HOTELS_API_ID $CARS_API_ID; do
  PUB=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
    "$KONNECT_API/v3/apis/$api_id/publications" | jq '.data[0]')
  echo "$PUB" | jq '{api_id: .api_id, visibility, auth_strategy_ids}'
done

echo -e "\n=== Pages ==="
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID/pages" | \
  jq '.data[] | {title, slug}'

echo -e "\n=== Teams ==="
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID/teams" | \
  jq '.data[] | {name}'
```

Open the portal in a browser and verify:
- [ ] Custom theme colors are applied
- [ ] Getting Started, Terms of Service, and Changelog pages are visible
- [ ] Flights and Hotels APIs are visible publicly
- [ ] Cars API is only visible after logging in as a developer in the right team
- [ ] Spec renderer shows interactive "Try It" panel

**Checkpoint.** All checks pass. The portal is production-ready.

---

## What you configured

| Feature | Objects | Purpose |
|---|---|---|
| **Branding** | Portal customization (theme, colors, spec renderer) | Match corporate identity |
| **Content** | Pages (Getting Started, Terms, Changelog) | Onboard developers with guides |
| **API Docs** | API documents (Quick Start on Flights API) | Per-API integration help |
| **Access Control** | Visibility (public/private) + Teams + RBAC | Control who sees what |
| **SSO** | Identity providers (OIDC/SAML) + team mapping | Enterprise authentication |
| **Snippets** | Reusable content blocks | Support banners, announcements |

---

## Dev Portal Architecture Summary

```
Konnect Organization
├── Dev Portal (mytravel-portal)
│   ├── Customization (theme, spec renderer)
│   ├── Pages (Getting Started, Terms, Changelog)
│   ├── Snippets (support-banner)
│   ├── Teams (travel-partners, public-developers)
│   ├── Identity Providers (OIDC / SAML)
│   └── Auth Settings (basic, IdP mapping)
│
├── API Products
│   ├── Flights API
│   │   ├── Version v1.0.0 (OpenAPI spec)
│   │   ├── Implementation → flights-svc on control plane
│   │   ├── Publication → portal (public, key-auth)
│   │   └── Document: Quick Start
│   ├── Hotels API
│   │   ├── Version v1.0.0 (OpenAPI spec)
│   │   ├── Implementation → hotels-svc
│   │   └── Publication → portal (public, key-auth)
│   └── Cars API
│       ├── Version v1.0.0 (OpenAPI spec)
│       ├── Implementation → cars-svc
│       └── Publication → portal (private, key-auth)
│
└── Application Auth Strategies
    └── mytravel-key-auth (key_auth)
```

---

*Congratulations! You've completed the Kong Developer Portal Bootcamp.*

*[<-- Back to Home](/)*

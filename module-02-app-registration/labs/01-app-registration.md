# Lab 02 - App Registration & Auth Strategies

> **Goal:** Configure authentication strategies on your portal so developers can register applications and receive API credentials. Set up the self-service flow end-to-end.
>
> Every step has a **Checkpoint** - if the expected output doesn't match, stop and fix before continuing.

## Prerequisites

- Lab 01 completed (portal created, 3 APIs published)
- Environment variables still set: `KONNECT_PAT`, `KONNECT_API`, `PORTAL_ID`, API IDs

```bash
# Quick check - portal exists
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID" | jq '{name, authentication_enabled}'
```

---

## The story continues

Your portal is live. External developers can browse the API catalog and read the docs. But they can't actually _use_ the APIs yet - there's no way for them to get credentials.

You need to:
1. Create an **authentication strategy** (how do apps prove identity?)
2. Attach it to your published APIs
3. Enable **developer self-service** so developers can register and create apps themselves
4. Walk through the flow as a developer would

---

## Step 1 - Understand Auth Strategies (~5 min)

Konnect supports two types of application auth strategies:

| Strategy | How it works | Best for |
|---|---|---|
| **Key Auth** | Developer gets a static API key, sends it in a header | Simple integrations, internal tools, getting started fast |
| **OpenID Connect** | Developer's app goes through an OAuth/OIDC flow with an external IdP | Production apps, fine-grained scopes, token rotation |

For this lab, you'll start with **Key Auth** (simple, no external IdP needed) and then explore **OIDC** as an advanced option.

---

## Step 2 - Create a Key Auth Strategy (~10 min)

### Via Konnect UI

1. Navigate to **Application Auth** in the sidebar
2. Click **New Auth Strategy**
3. Fill in:
   - **Name:** `mytravel-key-auth`
   - **Display Name:** `API Key Authentication`
   - **Strategy Type:** Key Auth
   - **Key Names:** `apikey` (the header name where the key is sent)
4. Click **Save**

### Via API

```bash
curl -s -X POST "$KONNECT_API/v3/application-auth-strategies" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mytravel-key-auth",
    "display_name": "API Key Authentication",
    "strategy_type": "key_auth",
    "configs": {
      "key_auth": {
        "key_names": ["apikey"]
      }
    }
  }' | jq '{id, name, strategy_type}'
```

Save the strategy ID:

```bash
export AUTH_STRATEGY_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/application-auth-strategies" | \
  jq -r '.data[] | select(.name=="mytravel-key-auth") | .id')
echo "Auth Strategy: $AUTH_STRATEGY_ID"
```

**Checkpoint.** `curl -s -H "Authorization: Bearer $KONNECT_PAT" "$KONNECT_API/v3/application-auth-strategies" | jq '.data[] | select(.name=="mytravel-key-auth") | {name, strategy_type}'` returns `key_auth`.

---

## Step 3 - Set Portal Default Auth Strategy (~5 min)

Make the key-auth strategy the default for your portal. Every new API publication will use this strategy unless overridden.

```bash
curl -s -X PATCH "$KONNECT_API/v3/portals/$PORTAL_ID" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "{
    \"default_application_auth_strategy_id\": \"$AUTH_STRATEGY_ID\"
  }" | jq '{name, default_application_auth_strategy_id}'
```

**Checkpoint.** The portal's `default_application_auth_strategy_id` is set to your strategy ID.

---

## Step 4 - Attach Auth Strategy to Published APIs (~10 min)

Each publication needs to know which auth strategy to use. Update the existing publications to attach the key-auth strategy.

First, get the publication IDs:

```bash
for api_id in $FLIGHTS_API_ID $HOTELS_API_ID $CARS_API_ID; do
  API_NAME=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
    "$KONNECT_API/v3/apis/$api_id" | jq -r '.name')
  PUB_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
    "$KONNECT_API/v3/apis/$api_id/publications" | jq -r '.data[0].id')
  echo "$API_NAME publication: $PUB_ID"
done
```

Update each publication with the auth strategy:

```bash
for api_id in $FLIGHTS_API_ID $HOTELS_API_ID $CARS_API_ID; do
  PUB_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
    "$KONNECT_API/v3/apis/$api_id/publications" | jq -r '.data[0].id')

  curl -s -X PATCH "$KONNECT_API/v3/apis/$api_id/publications/$PUB_ID" \
    -H "Authorization: Bearer $KONNECT_PAT" \
    -H "Content-Type: application/json" \
    -d "{
      \"auth_strategy_ids\": [\"$AUTH_STRATEGY_ID\"]
    }" | jq '{id, auth_strategy_ids}'
done
```

**Checkpoint.** Each publication now has `auth_strategy_ids` containing your strategy ID.

---

## Step 5 - Configure Developer Self-Service (~10 min)

Control how developers register and create applications on your portal.

### 5a. Review current settings

```bash
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID" | \
  jq '{auto_approve_developers, auto_approve_applications, authentication_enabled}'
```

### 5b. Enable auto-approve for developers (lab environment)

In production you'd want manual approval. For this lab, let developers self-register without waiting:

```bash
curl -s -X PATCH "$KONNECT_API/v3/portals/$PORTAL_ID" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "auto_approve_developers": true,
    "auto_approve_applications": true
  }' | jq '{auto_approve_developers, auto_approve_applications}'
```

### 5c. Understand the approval matrix

| Setting | `true` | `false` |
|---|---|---|
| `auto_approve_developers` | Developers can browse immediately after sign-up | Admin must approve before developer can see anything |
| `auto_approve_applications` | App gets credentials immediately | Admin must approve before credentials are issued |
| `authentication_enabled` | Developers must register/login | Anyone can browse (public portal) |

::: tip Production recommendation
Set both auto-approve flags to `false` in production. Use auto-approve only for internal portals or lab environments where speed matters more than control.
:::

**Checkpoint.** Both `auto_approve_developers` and `auto_approve_applications` return `true`.

---

## Step 6 - Walk Through the Developer Experience (~15 min)

Now experience the portal as an external developer would.

### 6a. Open the portal

```bash
PORTAL_URL=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID" | jq -r '.default_domain')
echo "Open: https://$PORTAL_URL"
```

### 6b. Register as a developer

1. Open the portal URL in a **private/incognito** browser window
2. Click **Sign Up** (or **Register**)
3. Fill in:
   - **Name:** Test Developer
   - **Email:** testdev@example.com
   - **Password:** (create one)
4. Submit - with auto-approve enabled, you're logged in immediately

### 6c. Create an application

1. Once logged in, click **My Apps** (or the user menu → Applications)
2. Click **New Application**
3. Fill in:
   - **Name:** `travel-booking-app`
   - **Description:** `Internal booking tool for travel agents`
4. Click **Create**

### 6d. Register for an API

1. From the API Catalog, click **Flights API**
2. Click **Register** (or **Request Access**)
3. Select your `travel-booking-app` application
4. With auto-approve enabled, access is granted immediately
5. You receive an **API key** - copy it

### 6e. Make an authenticated request

```bash
# Replace with your actual API key and gateway proxy URL
export API_KEY="your-key-from-portal"
export PROXY_URL="http://localhost:8000"

# Test the Flights API
curl -s -H "apikey: $API_KEY" "$PROXY_URL/api/bookstore" | jq '.'
```

**Checkpoint.** The request returns flight data. Without the `apikey` header, you get a 401.

---

## Step 7 - View Registrations as Admin (~5 min)

Back in the Konnect UI (as admin):

### Via UI

1. Navigate to **Dev Portal** → your portal → **Applications**
2. You should see `travel-booking-app` with status **Approved**
3. Click into it to see which APIs it has access to

### Via API

```bash
# List all applications on the portal
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID/applications" | \
  jq '.data[] | {name, id, created_at}'
```

**Checkpoint.** The `travel-booking-app` application is visible in the admin view.

---

## Step 8 - (Optional) OIDC Auth Strategy (~15 min)

For production use, you'd replace key-auth with OpenID Connect. Here's how the OIDC strategy works at a high level:

```bash
# Create an OIDC auth strategy (requires an external IdP like Okta, Auth0, or Keycloak)
curl -s -X POST "$KONNECT_API/v3/application-auth-strategies" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mytravel-oidc",
    "display_name": "OAuth 2.0 / OIDC",
    "strategy_type": "openid_connect",
    "configs": {
      "openid_connect": {
        "issuer": "https://your-idp.example.com/.well-known/openid-configuration",
        "credential_claim": ["sub"],
        "scopes": ["openid"],
        "auth_methods": ["client_credentials", "bearer"]
      }
    }
  }' | jq '{id, name, strategy_type}'
```

With OIDC:
- Developer registers an application on the portal
- Konnect (or your DCR provider) issues a `client_id` and `client_secret`
- The developer's app uses standard OAuth 2.0 flows to get access tokens
- Kong validates the JWT on every request

::: info Dynamic Client Registration (DCR)
For fully automated credential provisioning, configure a **DCR Provider** (Auth0, Okta, Azure AD, Curity, or HTTP). This lets Konnect automatically create OAuth clients in your IdP when developers register apps.
:::

---

## What you configured

| Object | Purpose |
|---|---|
| **Auth Strategy** | Defines how apps authenticate (key-auth or OIDC) |
| **Portal settings** | Controls developer/app auto-approval |
| **Publication + auth** | Links a strategy to each published API |
| **Developer registration** | External developers sign up on the portal |
| **Application** | A developer's app that holds credentials |
| **API registration** | Grants an app access to a specific API |

The self-service flow:

```
Developer signs up → (auto-approve or admin approves)
  → Creates Application → Registers for API
    → (auto-approve or admin approves)
      → Receives credentials → Makes authenticated requests
```

---

*Next: [Lab 03 - Portal Customization & Teams -->](/module-03-portal-customization/labs/01-portal-customization)*

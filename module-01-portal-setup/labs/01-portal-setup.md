# Lab 01 - Portal Setup & API Publishing

> **Goal:** Create a Developer Portal on Konnect, publish the mytravel.com APIs with OpenAPI specs, and link them to the gateway services you built in earlier bootcamps.
>
> Every step has a **Checkpoint** - if the expected output doesn't match, stop and fix before continuing.

## Prerequisites

| Requirement | Why |
|---|---|
| Konnect account | [cloud.konghq.com](https://cloud.konghq.com) (free tier includes Dev Portal) |
| Konnect PAT | Account → Tokens → Generate Token |
| Prior bootcamp services | `flights-svc`, `hotels-svc`, `cars-svc` running on your control plane |
| curl + jq | HTTP calls and JSON parsing |

```bash
# Set your PAT and geo-specific API base URL
export KONNECT_PAT="kpat_..."
export KONNECT_API="https://us.api.konghq.com"

# Verify access
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/me" | jq '{name: .full_name, org: .active_org.name}'
```

::: tip Where's the geo?
Konnect API URLs are geo-specific. Use `us.api.konghq.com`, `eu.api.konghq.com`, `au.api.konghq.com`, etc. to match where your org is hosted. Check the URL bar when you log in to Konnect.
:::

---

## The story so far

In the API Gateway bootcamp you built services for flights, hotels, and cars. In AI Gateway you added LLM proxying. In Agentic you added MCP endpoints. In APIOps you learned to manage all that config declaratively with decK.

**The problem:** Your APIs exist, but external developers have no way to discover them. Partners email your platform team asking "what endpoints do you have?" and wait days for a response. You need **self-service**.

This lab creates a Developer Portal where external developers can browse your API catalog, read interactive docs, and register for access - without ever contacting your team.

---

## Step 1 - Create the Developer Portal (~10 min)

### Via Konnect UI

1. Log in to [cloud.konghq.com](https://cloud.konghq.com)
2. In the left sidebar, click **Dev Portal**
3. Click **New Portal**
4. Fill in:
   - **Name:** `mytravel-portal`
   - **Display Name:** `mytravel.com Developer Portal`
   - **Description:** `APIs for the mytravel.com travel platform - flights, hotels, cars, and weather`
5. Leave **Authentication** enabled (default)
6. Click **Create**

### Via Konnect API

```bash
curl -s -X POST "$KONNECT_API/v3/portals" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mytravel-portal",
    "display_name": "mytravel.com Developer Portal",
    "description": "APIs for the mytravel.com travel platform - flights, hotels, cars, and weather",
    "authentication_enabled": true,
    "auto_approve_developers": false,
    "auto_approve_applications": false,
    "default_api_visibility": "public",
    "default_page_visibility": "public"
  }' | jq '{id, name, default_domain}'
```

Save the portal ID:

```bash
export PORTAL_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals" | jq -r '.data[] | select(.name=="mytravel-portal") | .id')
echo "Portal ID: $PORTAL_ID"
```

**Checkpoint.** `curl -s -H "Authorization: Bearer $KONNECT_PAT" "$KONNECT_API/v3/portals" | jq '.data[] | select(.name=="mytravel-portal") | {name, default_domain}'` returns your portal name and its auto-assigned domain.

---

## Step 2 - Create API Products (~15 min)

An **API Product** is the unit of publishing in Konnect. Each API product can have multiple versions, each with its own OpenAPI spec. Think of it as the catalog entry a developer sees.

### 2a. Create the Flights API product

**Via Konnect UI:**
1. Navigate to **API Products** in the sidebar
2. Click **Add API Product**
3. Fill in **Name:** `Flights API`, **Description:** `Search and book flights across airlines`
4. Click **Save**

**Via API:**

```bash
curl -s -X POST "$KONNECT_API/v3/apis" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "flights-api",
    "description": "Search and book flights across airlines"
  }' | jq '{id, name}'
```

### 2b. Create the remaining API products

```bash
# Hotels API
curl -s -X POST "$KONNECT_API/v3/apis" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "hotels-api",
    "description": "Search and book hotel rooms worldwide"
  }' | jq '{id, name}'

# Cars API
curl -s -X POST "$KONNECT_API/v3/apis" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "cars-api",
    "description": "Search and rent vehicles at any airport"
  }' | jq '{id, name}'
```

### 2c. Capture the API IDs

```bash
export FLIGHTS_API_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/apis" | jq -r '.data[] | select(.name=="flights-api") | .id')

export HOTELS_API_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/apis" | jq -r '.data[] | select(.name=="hotels-api") | .id')

export CARS_API_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/apis" | jq -r '.data[] | select(.name=="cars-api") | .id')

echo "Flights: $FLIGHTS_API_ID"
echo "Hotels:  $HOTELS_API_ID"
echo "Cars:    $CARS_API_ID"
```

**Checkpoint.** All three API IDs are non-empty UUIDs.

---

## Step 3 - Create API Versions & Upload OpenAPI Specs (~20 min)

Each API product needs at least one **version** with an OpenAPI spec attached. The spec powers the interactive documentation on the portal.

### 3a. Create the Flights OpenAPI spec

Create a file called `flights-openapi.yaml`:

```yaml
openapi: 3.1.0
info:
  title: Flights API
  version: "1.0.0"
  description: |
    Search and book flights across airlines. Part of the mytravel.com platform.

    ## Authentication
    All endpoints require an API key passed in the `apikey` header.

servers:
  - url: https://api.mytravel.com
    description: Production (via Kong Gateway)

paths:
  /api/flights:
    get:
      summary: List available flights
      operationId: listFlights
      tags: [Flights]
      parameters:
        - name: origin
          in: query
          schema: { type: string, pattern: "^[A-Z]{3}$" }
          description: Origin IATA airport code (e.g. LHR)
        - name: destination
          in: query
          schema: { type: string, pattern: "^[A-Z]{3}$" }
          description: Destination IATA airport code
        - name: date
          in: query
          schema: { type: string, format: date }
          description: Departure date
      responses:
        "200":
          description: Array of available flights
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Flight"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "429":
          $ref: "#/components/responses/RateLimited"

  /api/flights/{id}:
    get:
      summary: Get flight by ID
      operationId: getFlightById
      tags: [Flights]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: Flight details
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Flight"

  /api/bookings:
    post:
      summary: Book a flight
      operationId: createBooking
      tags: [Bookings]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BookingRequest"
      responses:
        "201":
          description: Booking confirmed
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BookingResponse"

components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey

  schemas:
    Flight:
      type: object
      properties:
        id: { type: integer }
        airline: { type: string }
        origin: { type: string }
        destination: { type: string }
        departure: { type: string, format: date-time }
        arrival: { type: string, format: date-time }
        price: { type: number, format: float }
        currency: { type: string, default: USD }

    BookingRequest:
      type: object
      required: [flight_id, passenger_name, seats]
      properties:
        flight_id: { type: integer }
        passenger_name: { type: string }
        seats: { type: integer, minimum: 1, maximum: 9 }

    BookingResponse:
      type: object
      properties:
        booking_id: { type: string, format: uuid }
        status: { type: string, enum: [confirmed, pending, cancelled] }
        flight: { $ref: "#/components/schemas/Flight" }

  responses:
    Unauthorized:
      description: Missing or invalid API key
    RateLimited:
      description: Rate limit exceeded
      headers:
        Retry-After:
          schema: { type: integer }

security:
  - ApiKeyAuth: []
```

### 3b. Upload the spec as an API version

```bash
# Create version v1 for Flights API with the OpenAPI spec
curl -s -X POST "$KONNECT_API/v3/apis/$FLIGHTS_API_ID/versions" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg spec "$(cat flights-openapi.yaml)" '{
    "name": "v1.0.0",
    "spec": {
      "content": $spec
    }
  }')" | jq '{id, name}'
```

::: info Spec format
The `spec.content` field accepts YAML or JSON strings. The spec is parsed and rendered as interactive documentation in the portal.
:::

### 3c. Create simple specs for Hotels and Cars

Create `hotels-openapi.yaml`:

```yaml
openapi: 3.1.0
info:
  title: Hotels API
  version: "1.0.0"
  description: Search and book hotel rooms worldwide. Part of the mytravel.com platform.

servers:
  - url: https://api.mytravel.com

paths:
  /api/hotels:
    get:
      summary: List available hotels
      operationId: listHotels
      tags: [Hotels]
      parameters:
        - name: city
          in: query
          schema: { type: string }
        - name: checkin
          in: query
          schema: { type: string, format: date }
        - name: checkout
          in: query
          schema: { type: string, format: date }
      responses:
        "200":
          description: Array of hotels
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id: { type: integer }
                    name: { type: string }
                    city: { type: string }
                    rating: { type: number }
                    price_per_night: { type: number }

  /api/hotels/{id}:
    get:
      summary: Get hotel by ID
      operationId: getHotelById
      tags: [Hotels]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: Hotel details

components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey

security:
  - ApiKeyAuth: []
```

Create `cars-openapi.yaml`:

```yaml
openapi: 3.1.0
info:
  title: Cars API
  version: "1.0.0"
  description: Search and rent vehicles at any airport. Part of the mytravel.com platform.

servers:
  - url: https://api.mytravel.com

paths:
  /api/cars:
    get:
      summary: List available rental cars
      operationId: listCars
      tags: [Cars]
      parameters:
        - name: airport
          in: query
          schema: { type: string, pattern: "^[A-Z]{3}$" }
        - name: pickup_date
          in: query
          schema: { type: string, format: date }
      responses:
        "200":
          description: Array of available cars
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id: { type: integer }
                    make: { type: string }
                    model: { type: string }
                    category: { type: string, enum: [economy, compact, midsize, suv, luxury] }
                    price_per_day: { type: number }

components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey

security:
  - ApiKeyAuth: []
```

Upload both:

```bash
# Hotels v1
curl -s -X POST "$KONNECT_API/v3/apis/$HOTELS_API_ID/versions" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg spec "$(cat hotels-openapi.yaml)" '{
    "name": "v1.0.0",
    "spec": { "content": $spec }
  }')" | jq '{id, name}'

# Cars v1
curl -s -X POST "$KONNECT_API/v3/apis/$CARS_API_ID/versions" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg spec "$(cat cars-openapi.yaml)" '{
    "name": "v1.0.0",
    "spec": { "content": $spec }
  }')" | jq '{id, name}'
```

**Checkpoint.** All three APIs have a v1.0.0 version with a spec. Verify:

```bash
for api_id in $FLIGHTS_API_ID $HOTELS_API_ID $CARS_API_ID; do
  echo "--- $(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
    "$KONNECT_API/v3/apis/$api_id" | jq -r '.name') ---"
  curl -s -H "Authorization: Bearer $KONNECT_PAT" \
    "$KONNECT_API/v3/apis/$api_id/versions" | jq '.data[] | {name, id}'
done
```

---

## Step 4 - Link Gateway Services (~10 min)

**Implementations** connect an API product to the actual gateway service running on your control plane. This is how the portal's "Try It" feature knows where to send requests.

### 4a. Find your control plane ID

```bash
export CP_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/control-planes" | jq -r '.data[0].id')
echo "Control Plane: $CP_ID"
```

### 4b. Find the gateway service IDs

```bash
# List services in your control plane
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/control-planes/$CP_ID/core-entities/services" | \
  jq '.data[] | {id, name}'
```

Capture the service IDs for your travel services:

```bash
export FLIGHTS_SVC_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/control-planes/$CP_ID/core-entities/services" | \
  jq -r '.data[] | select(.name=="flights-svc") | .id')

export HOTELS_SVC_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/control-planes/$CP_ID/core-entities/services" | \
  jq -r '.data[] | select(.name=="hotels-svc") | .id')

export CARS_SVC_ID=$(curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v2/control-planes/$CP_ID/core-entities/services" | \
  jq -r '.data[] | select(.name=="cars-svc") | .id')

echo "flights-svc: $FLIGHTS_SVC_ID"
echo "hotels-svc:  $HOTELS_SVC_ID"
echo "cars-svc:    $CARS_SVC_ID"
```

::: warning Service names may differ
If you used different names in the API Gateway bootcamp, adjust the `select(.name==...)` filter accordingly. Run the `jq '.data[] | {id, name}'` query to see all available services.
:::

### 4c. Create implementations

```bash
# Link Flights API → flights-svc
curl -s -X POST "$KONNECT_API/v3/apis/$FLIGHTS_API_ID/implementations" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"kong-service\",
    \"service_reference\": {
      \"service\": {
        \"id\": \"$FLIGHTS_SVC_ID\",
        \"control_plane_id\": \"$CP_ID\"
      }
    }
  }" | jq '{id, type}'

# Link Hotels API → hotels-svc
curl -s -X POST "$KONNECT_API/v3/apis/$HOTELS_API_ID/implementations" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"kong-service\",
    \"service_reference\": {
      \"service\": {
        \"id\": \"$HOTELS_SVC_ID\",
        \"control_plane_id\": \"$CP_ID\"
      }
    }
  }" | jq '{id, type}'

# Link Cars API → cars-svc
curl -s -X POST "$KONNECT_API/v3/apis/$CARS_API_ID/implementations" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"kong-service\",
    \"service_reference\": {
      \"service\": {
        \"id\": \"$CARS_SVC_ID\",
        \"control_plane_id\": \"$CP_ID\"
      }
    }
  }" | jq '{id, type}'
```

**Checkpoint.** Each API has an implementation linked to its gateway service:

```bash
for api_id in $FLIGHTS_API_ID $HOTELS_API_ID $CARS_API_ID; do
  curl -s -H "Authorization: Bearer $KONNECT_PAT" \
    "$KONNECT_API/v3/apis/$api_id/implementations" | \
    jq '.data[] | {id, type}'
done
```

---

## Step 5 - Publish APIs to the Portal (~10 min)

**Publications** make an API product visible on a specific portal. Without a publication, the API exists in the catalog but isn't shown to developers.

### Via Konnect UI

1. Navigate to **API Products** → select **Flights API**
2. Click the **Portal Publishing** tab
3. Click **Publish to Portal**
4. Select `mytravel-portal` → set visibility to **Public** → click **Publish**
5. Repeat for Hotels API and Cars API

### Via API

```bash
# Publish Flights API to the portal
curl -s -X POST "$KONNECT_API/v3/apis/$FLIGHTS_API_ID/publications" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "{
    \"portal_id\": \"$PORTAL_ID\",
    \"visibility\": \"public\",
    \"auto_approve_registrations\": true
  }" | jq '{id, visibility}'

# Publish Hotels API
curl -s -X POST "$KONNECT_API/v3/apis/$HOTELS_API_ID/publications" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "{
    \"portal_id\": \"$PORTAL_ID\",
    \"visibility\": \"public\",
    \"auto_approve_registrations\": true
  }" | jq '{id, visibility}'

# Publish Cars API
curl -s -X POST "$KONNECT_API/v3/apis/$CARS_API_ID/publications" \
  -H "Authorization: Bearer $KONNECT_PAT" \
  -H "Content-Type: application/json" \
  -d "{
    \"portal_id\": \"$PORTAL_ID\",
    \"visibility\": \"public\",
    \"auto_approve_registrations\": true
  }" | jq '{id, visibility}'
```

**Checkpoint.** All three APIs are published:

```bash
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID" | jq '{name, default_domain}'
```

Open the portal URL in your browser. You should see three API cards: Flights, Hotels, and Cars.

---

## Step 6 - Browse the Live Portal (~5 min)

1. Get your portal URL:

```bash
curl -s -H "Authorization: Bearer $KONNECT_PAT" \
  "$KONNECT_API/v3/portals/$PORTAL_ID" | jq -r '.default_domain'
```

2. Open `https://<your-portal-domain>` in a browser
3. Explore:
   - **API Catalog** - all three APIs are listed with descriptions
   - Click **Flights API** → you see the full OpenAPI documentation
   - The spec renderer shows endpoints, request/response schemas, and example payloads
   - The "Try It" panel lets developers make live requests (once authenticated)

**Checkpoint.** You can see all three APIs in the portal catalog, and clicking into one shows interactive OpenAPI documentation.

---

## What you just built

| Konnect Object | What it is | Count |
|---|---|---|
| **Portal** | The developer-facing website | 1 |
| **API Products** | Catalog entries (Flights, Hotels, Cars) | 3 |
| **API Versions** | v1.0.0 with OpenAPI specs | 3 |
| **Implementations** | Links to gateway services on your control plane | 3 |
| **Publications** | Makes APIs visible on the portal | 3 |

The flow: **API Product** → has **Versions** (with specs) → linked to **Gateway Service** (via Implementation) → published to **Portal** (via Publication).

---

## Key concepts

| Concept | Description |
|---|---|
| **API Product** | The top-level catalog entry. Has a name, description, and labels. Not tied to any specific gateway entity until you add an implementation. |
| **API Version** | A versioned snapshot of an API's spec. You can have v1, v2, etc. Each version can have its own OpenAPI or AsyncAPI spec. |
| **Implementation** | The bridge between the API catalog and the running gateway. Points to a Kong service on a specific control plane. |
| **Publication** | Controls which portal shows which API, and with what visibility (public vs private). |
| **Portal** | The developer-facing website. Renders specs, handles developer registration, and manages app credentials. |

---

*Next: [Lab 02 - App Registration & Auth Strategies -->](./02-app-registration)*

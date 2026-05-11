# 🚌 BusPlanen Frontend

Frontend for BusPlanen – en platform til at finde og booke billige busrejser i Europa.

Projektet er bygget som en moderne React + TypeScript frontend med feature-based struktur, backend-driven data og gamification omkring brugerens rejseprogression.

---

## ✨ Features

- Se kommende rejser
- Hero + featured rejser styret fra backend
- Booking flow via Stripe checkout
- Rollebaseret UI:
  - Kunde
  - Admin
  - Medarbejder
- “Mine bookinger” for brugere
- Admin panel til:
  - Busser
  - Rejser
  - Bookinger
- Badge system
- Travel history
- Progression dashboard
- Interaktivt rejsekort
- Territory progression
- Municipality progression
- Quest progression

---

## 🧠 Tech stack

- React + TypeScript
- Vite
- React Router
- React Leaflet
- Leaflet
- Feature-based struktur
- Custom API layer
- Backend-driven view models/adapters

---

## 🧱 Frontend arkitektur

Projektet følger en feature-based struktur:

```txt
src/
  features/
    auth/
    booking/
    bus/
    rejse/
    badges/
    travel-history/
    progression/
    payment/
    user/

  shared/
    api/
    auth/

  styles/
````

Generelt flow:

```txt
Backend DTO
→ API layer
→ frontend types
→ view model / adapter
→ dumb UI components
```

Målet er at holde komponenterne simple og flytte data-shaping ud i adapters/view models.

---

## 🗺️ Progression flow

Progression frontend er backend-driven.

```txt
/api/Progression/map
→ ProgressionMapResponse
→ buildProgressionDashboardView
→ map adapters
→ UI components
```

Progression dashboard viser:

* gennemførte rejser
* besøgte lokationer
* besøgte lande
* optjente badges
* interaktivt kort
* territory progression
* municipality progression
* quests
* travel history

Vigtige frontend dele:

```txt
features/progression/pages/ProgressionPage.tsx
features/progression/components/ProgressionMap.tsx
features/progression/components/ProgressionSidebar.tsx
features/progression/components/ActiveZoneDetailCard.tsx
features/progression/components/QuestProgressList.tsx
features/progression/view-model/buildProgressionDashboardView.ts
features/progression/map/mapTerritoryAdapter.ts
features/progression/map/mapMunicipalityAdapter.ts
```

---

## 🎮 Quests

Quest UI er baseret på backend data:

```txt
GET /api/Progression/quests
```

Frontend ejer kun rendering.

Backend ejer:

* quest status
* current / target
* completion percent
* reward label
* quest keys

---

## 🏅 Badges

Badges vises på progression dashboard.

Frontend henter:

```txt
GET /api/Badges
GET /api/Badges/mine
```

Frontend sammenligner alle badges med brugerens optjente badges og renderer locked/unlocked state.

---

## 📜 Travel history

Travel history vises på progression dashboard og bruges som brugerens historiske rejseoverblik.

Endpoint:

```txt
GET /api/TravelHistory/mine
```

---

## 🔌 API

Frontend bruger blandt andet følgende backend endpoints:

```txt
/api/rejse
/api/booking
/api/auth
/api/stripe
/api/Badges
/api/Badges/mine
/api/TravelHistory/mine
/api/Progression/map
/api/Progression/quests
```

Base URL styres via environment variable:

```env
VITE_API_BASE_URL=http://localhost:xxxx
```

---

## 🚀 Kør projektet lokalt

### 1. Install dependencies

```bash
npm install
```

### 2. Start dev server

```bash
npm run dev
```

App kører typisk på:

```txt
http://localhost:5173
```

---

## 🔐 Auth

* JWT gemmes i `localStorage`
* Bruger info gemmes som `me`
* UI ændrer sig baseret på rolle
* API wrapper sender token med requests

---

## 💳 Booking flow

```txt
Frontend → Stripe Checkout → Backend webhook → Booking oprettes
```

* Ingen direkte booking fra frontend
* Booking oprettes først efter verificeret betaling
* Checkout status læses fra backend

---

## 📌 Status

* Homepage er data-driven
* Booking + Stripe flow virker
* Admin flows fungerer
* API integration er stabil
* Progression dashboard er backend-driven
* Quests er backend-driven
* Badges og travel history er integreret
* Map flow er ryddet op med adapters/view model

---

## 🧱 Næste skridt

* Dokumentere progression frontend mere detaljeret
* UI polish på progression dashboard
* Bedre loading / empty states
* Search + filter på rejser
* Performance cleanup på map hvis data vokser
* Deployment setup

---

## ⚠️ Note

Projektet køres pt. lokalt i development.

Deployment setup kommer senere.

---

# English

# 🚌 BusPlanen Frontend

Frontend for BusPlanen – a platform for finding and booking affordable bus trips across Europe.

The project is built as a modern React + TypeScript frontend with a feature-based structure, backend-driven data, and gamification around the user’s travel progression.

---

## ✨ Features

- View upcoming trips
- Backend-driven hero and featured trips
- Booking flow through Stripe Checkout
- Role-based UI:
  - Customer
  - Admin
  - Employee
- “My bookings” for users
- Admin panel for:
  - Buses
  - Trips
  - Bookings
- Badge system
- Travel history
- Progression dashboard
- Interactive travel map
- Territory progression
- Municipality progression
- Quest progression

---

## 🧠 Tech stack

- React + TypeScript
- Vite
- React Router
- React Leaflet
- Leaflet
- Feature-based structure
- Custom API layer
- Backend-driven view models/adapters

---

## 🧱 Frontend architecture

The project follows a feature-based structure:

```txt
src/
  features/
    auth/
    booking/
    bus/
    rejse/
    badges/
    travel-history/
    progression/
    payment/
    user/

  shared/
    api/
    auth/

  styles/
````

General flow:

```txt
Backend DTO
→ API layer
→ frontend types
→ view model / adapter
→ dumb UI components
```

The goal is to keep components simple and move data-shaping into adapters and view models.

---

## 🗺️ Progression flow

The progression frontend is backend-driven.

```txt
/api/Progression/map
→ ProgressionMapResponse
→ buildProgressionDashboardView
→ map adapters
→ UI components
```

The progression dashboard shows:

* completed trips
* visited locations
* visited countries
* earned badges
* interactive map
* territory progression
* municipality progression
* quests
* travel history

Important frontend parts:

```txt
features/progression/pages/ProgressionPage.tsx
features/progression/components/ProgressionMap.tsx
features/progression/components/ProgressionSidebar.tsx
features/progression/components/ActiveZoneDetailCard.tsx
features/progression/components/QuestProgressList.tsx
features/progression/view-model/buildProgressionDashboardView.ts
features/progression/map/mapTerritoryAdapter.ts
features/progression/map/mapMunicipalityAdapter.ts
```

---

## 🎮 Quests

The quest UI is based on backend data:

```txt
GET /api/Progression/quests
```

The frontend only owns rendering.

The backend owns:

* quest status
* current / target
* completion percent
* reward label
* quest keys

---

## 🏅 Badges

Badges are shown on the progression dashboard.

The frontend fetches:

```txt
GET /api/Badges
GET /api/Badges/mine
```

The frontend compares all badges with the user’s earned badges and renders locked/unlocked states.

---

## 📜 Travel history

Travel history is shown on the progression dashboard and gives the user an overview of completed trips.

Endpoint:

```txt
GET /api/TravelHistory/mine
```

---

## 🔌 API

The frontend uses these backend endpoints, among others:

```txt
/api/rejse
/api/booking
/api/auth
/api/stripe
/api/Badges
/api/Badges/mine
/api/TravelHistory/mine
/api/Progression/map
/api/Progression/quests
```

The base URL is controlled through an environment variable:

```env
VITE_API_BASE_URL=http://localhost:xxxx
```

---

## 🚀 Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start dev server

```bash
npm run dev
```

The app usually runs on:

```txt
http://localhost:5173
```

---

## 🔐 Auth

* JWT is stored in `localStorage`
* User info is stored as `me`
* The UI changes based on user role
* The API wrapper sends the token with requests

---

## 💳 Booking flow

```txt
Frontend → Stripe Checkout → Backend webhook → Booking is created
```

* No direct booking creation from the frontend
* Booking is only created after verified payment
* Checkout status is read from the backend

---

## 📌 Status

* Homepage is data-driven
* Booking + Stripe flow works
* Admin flows work
* API integration is stable
* Progression dashboard is backend-driven
* Quests are backend-driven
* Badges and travel history are integrated
* Map flow has been cleaned up with adapters/view model

---

## 🧱 Next steps

* Document the progression frontend in more detail
* UI polish on the progression dashboard
* Better loading / empty states
* Search + filtering for trips
* Map performance cleanup if data grows
* Deployment setup

---

## ⚠️ Note

The project currently runs locally in development.

Deployment setup will come later.

---

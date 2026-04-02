# 🚌 BusPlanen Frontend

Frontend for BusPlanen – en platform til at finde og booke billige busrejser i Europa.

---

## ✨ Features

- Se kommende rejser (kun public + fremtidige)
- Hero + featured rejser styret fra backend
- Booking flow via Stripe checkout
- Rollebaseret UI (Kunde / Admin / Medarbejder)
- “Mine bookinger” for brugere
- Admin panel til:
  - Busser
  - Rejser
  - Bookinger

---

## 🧠 Tech stack

- React + TypeScript
- Vite
- React Router
- Feature-based struktur
- Custom API layer

---

## 🔌 API

Frontend bruger følgende endpoints fra backend:

- `/api/rejse`
- `/api/booking`
- `/api/auth`
- `/api/stripe`

Base URL styres via environment variable:

```

VITE_API_BASE_URL=[http://localhost:xxxx](http://localhost:xxxx)

````

---

## 🚀 Kør projektet lokalt

### 1. Install dependencies

```bash
npm install
````

### 2. Start dev server

```bash
npm run dev
```

App kører typisk på:

```
http://localhost:5173
```

---

## 🔐 Auth

* JWT gemmes i `localStorage`
* bruger info gemmes som `me`
* UI ændrer sig baseret på rolle

---

## 💳 Booking flow

```
Frontend → Stripe Checkout → Backend webhook → Booking oprettes
```

* Ingen direkte booking fra frontend
* Booking oprettes først efter betaling

---

## 📌 Status

* Homepage er 100% data-driven
* Booking + Stripe flow virker
* Admin flows fungerer
* API integration stabil

---

## 🧱 Næste skridt

* Search + filter på rejser
* UI polish
* bedre loading / empty states
* deployment

---

## ⚠️ Note

Projektet køres pt. lokalt (development).
Deployment setup kommer senere.

```

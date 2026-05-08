# Notify: High-Reliability WhatsApp OTP Auth

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)

**Notify** is an enterprise-grade authentication microservice designed for the Indian market. It replaces vulnerable SMS-based OTPs with secure, high-delivery WhatsApp messages using the official **Meta WhatsApp Cloud API**.

---

## 📖 Table of Contents
- [Executive Summary](#-executive-summary)
- [System Architecture](#-system-architecture)
- [Authentication Flow](#-authentication-flow)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Security & Best Practices](#-security--best-practices)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Executive Summary
Traditional SMS OTPs in India suffer from low delivery rates, high latency, and susceptibility to SIM-swapping. **Notify** solves this by leveraging WhatsApp's end-to-end encrypted platform to deliver authentication codes instantly. It features a sophisticated dual-column phone number storage system to handle internationalization seamlessly while defaulting to Indian standards.

---

## 🏗 System Architecture

The project follows a decoupled **Client-Server** architecture:

- **Server**: Express.js REST API with Sequelize ORM for transactional integrity.
- **Client**: React SPA optimized for mobile-first interactions.
- **State**: JWT-based stateless authentication.
- **Integration**: direct HTTP calls to Meta's Graph API for message delivery.

---

## 🔄 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Meta API
    participant DB

    User->>Frontend: Enters Phone Number
    Frontend->>Backend: POST /send-otp
    Backend->>DB: Store OTP + Expiry
    Backend->>Meta API: Send Template Message
    Meta API-->>User: WhatsApp Message Received
    User->>Frontend: Enters 6-digit Code
    Frontend->>Backend: POST /verify-otp
    Backend->>DB: Validate OTP (Single-use)
    Backend->>DB: Find/Create User
    Backend-->>Frontend: Set JWT Token
    Frontend->>User: Redirect to Dashboard
```

---

## 🛠 Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Backend** | Node.js / Express | Event-driven I/O for high-concurrency auth requests. |
| **Frontend** | React + Vite | Blazing fast build times and modular UI components. |
| **Database** | PostgreSQL | Relational integrity for user-phone mappings. |
| **ORM** | Sequelize | Abstracted SQL with migration support for schema evolution. |
| **Styling** | Vanilla CSS | Zero-runtime overhead; premium glassmorphic aesthetics. |
| **Icons** | Lucide-React | Lightweight, consistent SVG icon set. |

---

## ✨ Features

- **✅ Smart Country Code Splitting**: Intelligently separates `countryCode` (e.g., 91) from `phoneNumber` to optimize indexing and internationalization.
- **✅ Glassmorphism UI**: High-end visual design with blur effects and sleek transitions.
- **✅ OTP Lifecycle Management**: Configurable expiration windows and strict "one-time-use" enforcement.
- **✅ Protected Routing**: React Router middleware to prevent unauthorized access to the dashboard.
- **✅ Production-Ready Migrations**: Fully versioned database schemas using Sequelize CLI.

---

## 🚀 Getting Started

### Prerequisites
- **PostgreSQL 14+**
- **Meta Developer Account**: Setup a WhatsApp Business App [here](https://developers.facebook.com/).

### Installation

1. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/yourusername/notify.git
   cd notify
   # Install server deps
   cd server && npm install
   # Install client deps
   cd ../client && npm install
   ```

2. **Environment Configuration**
   Create `server/.env` based on the following:

| Key | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Postgres Connection String | `postgres://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret for token signing | `openssl rand -base64 32` |
| `WHATSAPP_ACCESS_TOKEN` | Meta Permanent Access Token | `EAAG...` |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Phone ID | `10234857...` |
| `OTP_EXPIRY_MINUTES` | OTP Validity duration | `5` |

3. **Database Setup**
   ```bash
   cd server
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

4. **Run Development Servers**
   ```bash
   # Server (Port 5000)
   npm run dev
   # Client (Port 5173)
   cd ../client && npm run dev
   ```

---

## 📡 API Reference

### 1. Request OTP
`POST /api/auth/send-otp`
```json
{
  "phoneNumber": "9876543210" 
}
```
*Note: If no country code is provided, +91 (India) is assumed.*

### 2. Verify OTP
`POST /api/auth/verify-otp`
```json
{
  "phoneNumber": "9876543210",
  "code": "123456"
}
```
**Response (Success):**
```json
{
  "token": "eyJhbG...",
  "user": { "id": 1, "countryCode": "91", "phoneNumber": "9876543210" }
}
```

---

## 🗄 Database Schema

### `Users` Table
| Field | Type | Attributes |
| :--- | :--- | :--- |
| `id` | `Integer` | PK, Auto-increment |
| `countryCode` | `String` | Not Null, Default: '91' |
| `phoneNumber` | `String` | Not Null |
| **Index** | `Unique` | `(countryCode, phoneNumber)` |

### `Otps` Table
| Field | Type | Attributes |
| :--- | :--- | :--- |
| `code` | `String` | Not Null |
| `expiresAt` | `Date` | Not Null |
| `isUsed` | `Boolean` | Default: `false` |

---

## 🔒 Security & Best Practices

1. **Composite Indexing**: Prevents race conditions where multiple users could be created for the same phone/code combination.
2. **Stateless JWT**: Tokens are signed with HS256. For production, consider using `HttpOnly` cookies for storage.
3. **Atomic OTP Checks**: The system checks `isUsed`, `expiresAt`, and the `code` in a single query to minimize attack vectors.
4. **WhatsApp Template Enforcement**: Uses official Meta templates to ensure messages are not flagged as spam.

---

## 🤝 Contributing

We welcome contributions! To maintain code quality:
1. **Branching**: Use `feature/` or `fix/` prefixes.
2. **Linting**: Ensure `eslint` passes before submitting.
3. **Pull Requests**: Provide a clear description of the change and any related issues.

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📧 Contact & Support
**Project Maintainer**: [Your Name/Org]
**GitHub**: [@yourusername](https://github.com/yourusername)

---
*Developed with ❤️ for the Indian Developer Community.*

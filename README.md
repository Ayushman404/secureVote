# 🗳️ Anonymous Voting System using Linkable Ring Signatures (LRS)

A secure, privacy-preserving voting platform built with Node.js and React. It enables anonymous yet verifiable voting using Linkable Ring Signatures, designed for institutional or community-based elections.

🔗 **Live Demo**: [Click to visit](https://secure-vote-frontend.onrender.com)

---

## 🔍 Overview

This system allows users to cast votes anonymously while ensuring that no one can vote more than once. Authentication is currently handled via **Google OAuth** as a temporary workaround, due to integration challenges with Azure Active Directory (AAD) for domain-restricted login. The intended setup is to allow only IIT Patna users to vote via institutional authentication.

Votes are cryptographically signed using Linkable Ring Signatures (LRS), ensuring:
- Anonymity: No one can trace a vote back to a voter.
- Linkability: Multiple votes from the same user can be detected and rejected.

---

## ✨ Features

- 🔒 Anonymous voting using Linkable Ring Signatures
- ✅ One-vote enforcement via linkability tags
- 👤 Google OAuth authentication
- 🛡️ Rate limiting and input validation to prevent abuse
- ⚙️ Admin-only control panel to open/close registration and voting process
- 📊 Real-time vote counting and result display(admin only- when voting and registration closed)
- ⚠️ Users must vote using the **same device and browser** they registered from

---

## 🔐 Authentication Notes

The platform was originally designed for **domain-specific login** (e.g., `@iitp.ac.in`) via Azure AD. However, due to enterprise-level limitations and configuration restrictions, we’ve temporarily switched to Google OAuth.

Domain-specific login remains a planned feature for production.

---

## 🧠 How Anonymous Voting Works (LRS - Brief)

- Each user participates in a cryptographic “ring” of public keys.
- When casting a vote, they sign it with a **Linkable Ring Signature**, proving they're part of the group without revealing their identity.
- A unique **linkability tag** prevents multiple votes from the same user without compromising anonymity.

---

## 🛠️ Challenges & Insights

This project demanded solving real-world cryptographic and engineering problems:
- Building secure and correct LRS logic (curve operations, randomness, linking, ring generation)
- Handling cryptographic identity on the frontend without leaking sensitive data
- Bridging OAuth and anonymous voting while preserving integrity
- Implementing admin dashboard with control of voting process
- Integrating security middleware (rate limiting, validation, helmet)

---

## 📚 What I Learned

- Practical application of **elliptic curve cryptography** (secp256k1)
- Deep understanding of **Linkable Ring Signatures**
- Building secure, full-stack systems with both **usability and anonymity**
- OAuth 2.0 integrations mechanisms
- Frontend-crypto interactions and secure identity management
- Real-world project planning and tradeoff decisions
- Deploying a full stack project and connecting client and server, cors and more..

---

## ⚙️ Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Cryptography**: elliptic.js (`secp256k1`), crypto
- **Authentication**: Google OAuth 2.0
- **Security**: express-rate-limit, express-validator, helmet, CORS

---

## 👨‍💼 Admin Access

An admin-only dashboard exists for election management and result handling. It is accessible only to authorized users and not exposed via public routes.

---

> Built with security, privacy, and purpose in mind — this system is a personal initiative to explore advanced cryptographic systems in real applications.

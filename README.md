# 🌑 FastWoke Protocol

![Status](https://img.shields.io/badge/Status-Beta-yellow)
![Protocol](https://img.shields.io/badge/Protocol-P2P%20Serverless-purple)
![License](https://img.shields.io/badge/License-MIT-green)

**FastWoke** is a censorship-resistant labor market protocol. It enables "Work-for-Debt" settlements using **Nano (XNO)** for instant, feeless payments and **Nostr** for decentralized discovery.

> *"We don't pay wages; we settle debts."*

---

## 🚀 Features

* **Ghost Mode:** No central server, no database, no KYC.
* **Zero Fees:** Powered by Nano. 100% of the value goes to the worker.
* **Trustless Escrow:** Uses Client-Side Shamir's Secret Sharing (SSS). Funds are locked mathematically, not by a third-party bank.
* **Unstoppable:** Job posts are broadcasted to global Nostr relays.

---

## 🛠 Tech Stack

* **Language:** TypeScript (React Native / Node.js)
* **Cryptography:** Ed25519 (Nostr), Blake2b (Nano), SSS (Escrow)
* **Network:** WebSocket (Nostr Relays), RPC (Nano Nodes)

---

## 📦 Installation (For Developers)

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/your-org/fastwoke-core.git
    cd fastwoke-core
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Simulation (POC)**
    ```bash
    node master_manual.js
    ```
    *This will generate a real Nano address and broadcast a test job to Nostr.*

---

## ⚠️ Security Warning

This software handles **Private Keys** and **Real Money**.
-   Never share your screen while generating contracts.
-   `Share_A` and `Share_B` must never meet until the work is done.
-   Use at your own risk.

---

## 🤝 Contributing

We are looking for:
-   **Rust Developers** (for Holochain integration)
-   **React Native UI/UX Designers** (for Mobile App)

Join us on Nostr: `npub1...`

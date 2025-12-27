# 🏗️ FastWoke System Architecture

**Version 1.0 (Mobile Implementation)**

ระบบนี้ไม่ได้รันบน Server เดียว แต่เป็นการทำงานร่วมกันของ 3 เครือข่ายอิสระ

### 1. High-Level Diagram (แผนผังโครงสร้าง)

```text
USER A (Creditor)                  USER B (Debtor)
[ Mobile App ]                     [ Mobile App ]
      |                                  |
      | (1) Public Announce (Nostr)      |
      |--------------------------------->|
      |                                  |
      | (2) P2P Handshake (Holochain)    |
      |<================================>|
      |                                  |
      | (3) Escrow Shard Exchange        |
      |------(Shard B Encrypted)-------->|
      |                                  |
      | (4) Settlement (Nano Network)    |
      |                                  |<---(Broadcast Tx)---- [ NANO NODES ]
```

### 2. Component Design (ส่วนประกอบภายในแอป)

ในแอป 1 ตัว (เช่นไฟล์ `.apk`) จะประกอบด้วย 3 โมดูลหลัก:

* **Module A: The Radio (Nostr Client)**
    * หน้าที่: ดึง Feed ประกาศงาน, ส่ง DM หาคู่สัญญา
    * Lib: `nostr-tools`, `NDK`

* **Module B: The Vault (Crypto Engine)**
    * หน้าที่: สร้าง Wallet, คำนวณ SSS (Shamir's Secret Sharing), เซ็น Transaction
    * Lib: `nanocurrency-web`, `shamirs-secret-sharing`

* **Module C: The Ledger (Local Database)**
    * หน้าที่: เก็บประวัติงาน, เก็บ Key Share ของตัวเอง (ห้ามหลุด)
    * Tech: `SQLite` (แบบเข้ารหัส) หรือ `Holochain` (ถ้าต้องการความล้ำ)

---

# 📄 API Specification (Internal)

เนื่องจากเราไม่มี Server กลาง API เหล่านี้คือ **Function ภายในแอป** (Local API)

### 1. `Job Creation`

```typescript
function createContract(budget: number, description: string): JobObject
```

* **Input:** งบประมาณ (Nano), รายละเอียดงาน
* **Process:**
    1. Generate Nano Seed.
    2. Split Seed -> `Share_A`, `Share_B`.
    3. Encrypt `Share_B` ด้วย PubKey ของคนทั่วไป (หรือรอคนมาสมัครค่อยเข้ารหัส).
    4. Broadcast Event to Nostr.

* **Output:** `eventId` (Nostr), `jobAddress` (Nano)

### 2. `Escrow Settlement`

```typescript
function settleContract(shareA: string, shareB: string): TransactionHash
```

* **Input:** กุญแจส่วน A (จากนายจ้าง), กุญแจส่วน B (ของตัวเอง)
* **Process:**
    1. Combine `Share_A` + `Share_B` = `Private Key`.
    2. Derive Address -> Check Balance.
    3. Construct Block -> Sign Block -> Broadcast.

* **Output:** `blockHash` (ยืนยันว่าเงินเข้าแล้ว)

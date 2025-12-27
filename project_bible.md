# FastWoke: Reverse Debt Edition - Project Bible

## Part 1: System Architecture Design (แผนผังระบบ)

ระบบนี้ทำงานแบบ **Local-First & P2P** โดยสมบูรณ์ ไม่มี Server กลาง

**คำอธิบาย Diagram:**

1. **Discovery Layer (Nostr):** ทำหน้าที่เหมือน "ตลาดนัด" ประกาศหาคู่ค้า (Public).
2. **Handshake:** เมื่อ A และ B เจอกัน จะแลก PubKey และย้ายไปคุยในท่อส่วนตัว.
3. **Application Layer (Holochain):** เป็น "สำนักงานทนายความส่วนตัว" เก็บสัญญาและแชท (Private).
4. **Escrow Logic (Key Sharding):** กุญแจกระเป๋าเงินถูกหักครึ่ง แยกเก็บที่เครื่อง A และ B.
5. **Settlement Layer (Nano):** เมื่อเงื่อนไขครบ กุญแจถูกประกอบร่าง และสั่งโอนเงินบน Nano Network.

---

## Part 2: Technical Documentation (เอกสารทางเทคนิค)

**Project Name:** FastWoke Protocol
**Version:** 1.0.0 (Genesis)
**Type:** Serverless P2P Application

### 2.1 Technology Stack (สเปกที่ต้องใช้)

* **Core Backend (DNA):** Holochain (Rust / HDK version latest)
* **Frontend (UI):** Flutter หรือ React Native (TypeScript)
* **Networking:** Nostr Protocol (WebSocket via NDK)
* **Cryptography:**
    * *Coin:* Nano (XNO) - library: `nanocurrency-web`
    * *Escrow:* Shamir's Secret Sharing (SSS) - library: `sss-wasm`

### 2.2 Data Schema (โครงสร้างข้อมูลใน Holochain)

นี่คือโครงสร้างข้อมูลที่ต้องเขียนลงในไฟล์ Rust (`zomes/loan_core/src/lib.rs`)

```rust
// 1. Loan Contract Entry (สัญญาเงินกู้)
struct LoanContract {
    pub creditor_pubkey: AgentPubKey,  // ผู้จ้าง (เจ้าหนี้)
    pub debtor_pubkey: AgentPubKey,    // ฟรีแลนซ์ (ลูกหนี้)
    pub principal_nano_raw: String,    // ยอดเงิน (เก็บเป็น Raw Unit)
    pub job_description_hash: String,  // Hash ของรายละเอียดงาน (เก็บเนื้อหาจริงใน Local)
    pub contract_terms: String,        // เงื่อนไข (JSON: due_date, revision_limit)
    pub job_wallet_pubkey: String,     // Address ของ Nano Wallet ที่ใช้ล็อกเงิน
    pub status: LoanStatus,            // Enum: Pending, Funded, Active, Completed, Disputed
}

// 2. Encrypted Chat Entry (แชทส่วนตัว)
struct PrivateMessage {
    pub sender: AgentPubKey,
    pub receiver: AgentPubKey,
    pub content_encrypted: String,     // ข้อความที่เข้ารหัสแล้ว
    pub timestamp: Timestamp,
}

// 3. Key Share Entry (ชิ้นส่วนกุญแจ)
// ใช้สำหรับส่งมอบกุญแจเมื่ออนุมัติงาน
struct KeyShareSignal {
    pub target_contract_hash: EntryHash,
    pub encrypted_key_shard: String,   // ชิ้นส่วนกุญแจที่เข้ารหัสด้วย PubKey อีกฝ่าย
}
```

### 2.3 Escrow Logic (Client-Side Sharding Workflow)

**Algorithm:** 2-of-2 Scheme (ต้องใช้ 2 คนเพื่อไขกุญแจ)

1. **Initiation:** แอปเครื่อง Creditor สร้าง Nano Seed -> Split Seed เป็น `Shard_A` และ `Shard_B`.
2. **Locking:** แอปส่ง `Shard_B` ไปให้เครื่อง Debtor (เก็บไว้เฉยๆ ยังใช้ไม่ได้) -> Creditor โอน Nano เข้า Wallet.
3. **Settlement:**
    * Creditor กด "Approve".
    * Holochain สั่งให้เครื่อง Creditor ส่ง `Shard_A` ไปให้ Debtor.
    * เครื่อง Debtor นำ `Shard_A` + `Shard_B` มารวมกัน = **Private Key**.
    * เครื่อง Debtor สั่ง Sign Transaction โอนเงินเข้ากระเป๋าตัวเอง.

use hdk::prelude::*;

// 1. Loan Contract Entry (สัญญาเงินกู้)
#[hdk_entry_helper]
#[derive(Clone, PartialEq)]
pub struct LoanContract {
    pub creditor_pubkey: AgentPubKey,  // ผู้จ้าง (เจ้าหนี้)
    pub debtor_pubkey: AgentPubKey,    // ฟรีแลนซ์ (ลูกหนี้)
    pub principal_nano_raw: String,    // ยอดเงิน (เก็บเป็น Raw Unit)
    pub job_description_hash: String,  // Hash ของรายละเอียดงาน (เก็บเนื้อหาจริงใน Local)
    pub contract_terms: String,        // เงื่อนไข (JSON: due_date, revision_limit)
    pub job_wallet_pubkey: String,     // Address ของ Nano Wallet ที่ใช้ล็อกเงิน
    pub status: LoanStatus,            // Enum: Pending, Funded, Active, Completed, Disputed
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum LoanStatus {
    Pending,
    Funded,
    Active,
    Completed,
    Disputed,
}

// 2. Encrypted Chat Entry (แชทส่วนตัว)
#[hdk_entry_helper]
#[derive(Clone, PartialEq)]
pub struct PrivateMessage {
    pub sender: AgentPubKey,
    pub receiver: AgentPubKey,
    pub content_encrypted: String,     // ข้อความที่เข้ารหัสแล้ว
    pub timestamp: Timestamp,
}

// 3. Key Share Entry (ชิ้นส่วนกุญแจ)
// ใช้สำหรับส่งมอบกุญแจเมื่ออนุมัติงาน
#[hdk_entry_helper]
#[derive(Clone, PartialEq)]
pub struct KeyShareSignal {
    pub target_contract_hash: EntryHash,
    pub encrypted_key_shard: String,   // ชิ้นส่วนกุญแจที่เข้ารหัสด้วย PubKey อีกฝ่าย
}

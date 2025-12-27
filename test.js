// FastWoke: Key Sharding Simulation (2-of-2 Scheme)
// This script simulates the "Escrow Logic" described in the Project Bible.

const crypto = require('crypto');

// --- Helper Functions (Simulating Cryptography) ---

// Generate a random Nano Seed (64 hex characters)
function generateNanoSeed() {
    return crypto.randomBytes(32).toString('hex');
}

// 2-of-2 Shamir's Secret Sharing (Simplified using XOR for demonstration)
// In a 2-of-2 scheme, if use XOR: ShareA = Random, ShareB = Secret XOR ShareA
// Reconstruct: Secret = ShareA XOR ShareB
function splitKey(secretHex) {
    const secretBuffer = Buffer.from(secretHex, 'hex');
    const shareABuffer = crypto.randomBytes(secretBuffer.length);
    const shareBBuffer = Buffer.alloc(secretBuffer.length);

    for (let i = 0; i < secretBuffer.length; i++) {
        shareBBuffer[i] = secretBuffer[i] ^ shareABuffer[i];
    }

    return {
        shard_a: shareABuffer.toString('hex'),
        shard_b: shareBBuffer.toString('hex')
    };
}

function combineKeys(shardAHex, shardBHex) {
    const shareABuffer = Buffer.from(shardAHex, 'hex');
    const shareBBuffer = Buffer.from(shardBHex, 'hex');
    const secretBuffer = Buffer.alloc(shareABuffer.length);

    for (let i = 0; i < shareABuffer.length; i++) {
        secretBuffer[i] = shareABuffer[i] ^ shareBBuffer[i];
    }

    return secretBuffer.toString('hex');
}

// --- The Simulation Flow ---

console.log("🚀 Starting FastWoke Escrow Simulation...\n");

// 1. Initiation: Creditor App creates Nano Seed
console.log("[1] Initiation: Generating Nano Seed...");
const originalSeed = generateNanoSeed();
console.log(`    > Original Seed: ${originalSeed.substring(0, 10)}...[HIDDEN]`);

// 2. Encryption/Sharding
console.log("[2] Locking: Splitting Seed into 2 Shards...");
const shards = splitKey(originalSeed);
const shard_a = shards.shard_a; // Kept by Creditor initially
const shard_b = shards.shard_b; // Sent to Debtor
console.log(`    > Shard A (Creditor): ${shard_a.substring(0, 10)}...`);
console.log(`    > Shard B (Debtor):   ${shard_b.substring(0, 10)}...`);
console.log("    > Status: Funds Locked. Neither party can move funds alone.\n");

// 3. Settlement (Triggered by Approval)
console.log("[3] Settlement: Work Approved. Releasing Shard A to Debtor...");

// Debtor receives Shard A and combines it with Shard B
const reconstructedSeed = combineKeys(shard_a, shard_b);
console.log(`    > Debtor Recombining Keys...`);

// Verification
if (reconstructedSeed === originalSeed) {
    console.log(`    > Reconstructed: ${reconstructedSeed.substring(0, 10)}...[MATCH]`);
    console.log("\n✅ RESULT: กุญแจถูกต้อง! ระบบทำการโอนเงินเข้ากระเป๋าลูกหนี้สำเร็จ");
} else {
    console.log(`    > Reconstructed: ${reconstructedSeed.substring(0, 10)}...[MISMATCH]`);
    console.error("\n❌ ERROR: Key reconstruction failed!");
}

// master_employer_v2.js - แก้ไขเรื่อง Link ให้เป็น nevent1...
const nano = require('nanocurrency-web');
const sss = require('shamirs-secret-sharing');
// เพิ่ม nip19 เข้ามาเพื่อแปลงรหัส
const { Relay, generateSecretKey, finalizeEvent, nip19 } = require('nostr-tools');
const WebSocket = require('ws');

// Polyfill WebSocket for Node.js environment (Required for nostr-tools v2+)
global.WebSocket = WebSocket;

const RELAY_URL = 'wss://relay.damus.io';
const toBuffer = (str) => Buffer.from(str, 'hex');
const toHex = (buf) => buf.toString('hex');

async function createFastWokeContract() {
    console.log("---------------------------------------------------");
    console.log("💀 FASTWOKE MASTER PROTOCOL (V2): FIXED LINK");
    console.log("---------------------------------------------------");

    // --- STEP 1: การเงิน ---
    console.log("\n[1] 💰 Creating Job Wallet...");
    const wallet = nano.wallet.generate();
    const secret = toBuffer(wallet.seed);
    const shares = sss.split(secret, { shares: 2, threshold: 2 });

    const jobAddress = wallet.accounts[0].address;
    const shareCreditor = toHex(shares[0]);
    const shareDebtor = toHex(shares[1]);

    console.log(`    ✅ Job Wallet: ${jobAddress}`);
    console.log(`    🔐 Key Sharded Success!`);

    // --- STEP 2: การสื่อสาร ---
    console.log("\n[2] 📡 Broadcasting to Nostr...");

    try {
        const relay = await Relay.connect(RELAY_URL);

        const jobContent = `
[FASTWOKE CONTRACT V2]
Role: Developer (Reverse Debt)
Budget: 100 Nano (Escrowed)
Address: ${jobAddress}
#fastwoke #nano #job
        `;

        const sk = generateSecretKey();
        const event = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['t', 'fastwoke']],
            content: jobContent,
        };

        const signedEvent = finalizeEvent(event, sk);
        await relay.publish(signedEvent);

        // --- จุดที่แก้ไข: แปลง Hex ID เป็น nevent1 ---
        // นี่คือท่ามาตรฐานที่ njump.me ต้องการ
        const nevent = nip19.neventEncode({
            id: signedEvent.id,
            relays: [RELAY_URL] // บอกด้วยว่าหาเจอที่ Relay ไหน
        });

        console.log(`    ✅ Broadcast Success!`);
        console.log(`    ---------------------------------------------------`);
        // ลิงก์นี้จะขึ้นต้นด้วย nevent1... รับรองเปิดได้ชัวร์
        console.log(`    🌍 CLICK HERE 👉 https://njump.me/${nevent}`);
        console.log(`    ---------------------------------------------------`);

        relay.close();
    } catch (error) {
        console.error("❌ Error broadcasting to Nostr:", error);
    }
}

createFastWokeContract();

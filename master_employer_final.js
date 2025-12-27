// master_employer_final.js
// ใช้ Hex ID เพื่อแก้ปัญหา Terminal ตัดข้อความ
const nano = require('nanocurrency-web');
const sss = require('shamirs-secret-sharing');
const { Relay, generateSecretKey, finalizeEvent } = require('nostr-tools');
const WebSocket = require('ws');

// Polyfill WebSocket for Node.js environment (Required for nostr-tools v2+)
global.WebSocket = WebSocket;

const RELAY_URL = 'wss://relay.damus.io';
const toBuffer = (str) => Buffer.from(str, 'hex');
const toHex = (buf) => buf.toString('hex');

async function createFastWokeContract() {
    console.log("---------------------------------------------------");
    console.log("💀 FASTWOKE MASTER PROTOCOL: FINAL FIX");
    console.log("---------------------------------------------------");

    // --- STEP 1: การเงิน ---
    console.log("\n[1] 💰 Creating Job Wallet...");
    const wallet = nano.wallet.generate();
    const secret = toBuffer(wallet.seed);
    const shares = sss.split(secret, { shares: 2, threshold: 2 });

    const jobAddress = wallet.accounts[0].address;
    console.log(`    ✅ Job Wallet: ${jobAddress}`);

    // --- STEP 2: การสื่อสาร ---
    console.log("\n[2] 📡 Broadcasting to Nostr...");

    try {
        const relay = await Relay.connect(RELAY_URL);

        const jobContent = `
[FASTWOKE CONTRACT FINAL]
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

        console.log(`    ✅ Broadcast Success!`);
        console.log(`    ---------------------------------------------------`);
        // ใช้ Hex ID (signedEvent.id) แทน nevent เพื่อความชัวร์ (ไม่มีจุดแน่นอน)
        console.log(`    🌍 CLICK HERE 👉 https://njump.me/${signedEvent.id}`);
        console.log(`    ---------------------------------------------------`);

        relay.close();
    } catch (error) {
        console.error("❌ Error broadcasting to Nostr:", error);
    }
}

createFastWokeContract();

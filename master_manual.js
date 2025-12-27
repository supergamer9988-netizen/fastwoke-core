// master_manual.js
// พิมพ์รหัสออกมาให้ก๊อปไปวางเอง เพื่อแก้ปัญหา Terminal ตัดคำ
const nano = require('nanocurrency-web');
const sss = require('shamirs-secret-sharing');
const { Relay, generateSecretKey, finalizeEvent } = require('nostr-tools');
const WebSocket = require('ws');

// Polyfill WebSocket for Node.js environment
global.WebSocket = WebSocket;

const RELAY_URL = 'wss://relay.damus.io';
const toBuffer = (str) => Buffer.from(str, 'hex');

async function createFastWokeContract() {
    console.log("\n==================================================");
    console.log("💀 FASTWOKE: MANUAL COPY MODE");
    console.log("==================================================");

    // 1. สร้างเงิน (Finance)
    const wallet = nano.wallet.generate();
    const jobAddress = wallet.accounts[0].address;
    console.log(`[1] 💰 Job Address: ${jobAddress}`);

    // 2. สร้างประกาศ (Nostr)
    console.log(`[2] 📡 Broadcasting...`);

    try {
        const relay = await Relay.connect(RELAY_URL);

        const event = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['t', 'fastwoke']],
            content: `[FASTWOKE MANUAL TEST]\nAddress: ${jobAddress}\n#fastwoke`,
        };

        const signedEvent = finalizeEvent(event, generateSecretKey());
        await relay.publish(signedEvent);

        console.log(`✅ Broadcast Done!`);
        console.log("\n👇 *** ให้ทำตาม 2 บรรทัดข้างล่างนี้ *** 👇");
        console.log("--------------------------------------------------");

        // พิมพ์ ID ออกมาตรงๆ (Hex ID)
        console.log(`1. ก๊อปปี้รหัสนี้ (ห้ามเกิน ห้ามขาด):`);
        console.log(signedEvent.id);

        console.log(`\n2. ไปที่เว็บนี้ แล้วเอารหัสไปวางในช่องค้นหา:`);
        console.log(`   https://njump.me`);
        console.log("--------------------------------------------------");

        relay.close();
    } catch (error) {
        console.error("❌ Error broadcasting:", error);
    }
}

createFastWokeContract();

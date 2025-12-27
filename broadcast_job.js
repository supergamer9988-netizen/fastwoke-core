// broadcast_job.js
// สคริปต์จำลองการ "ประกาศงาน" ขึ้นสู่โลก Decentralized
const { Relay, generateSecretKey, finalizeEvent, nip19 } = require('nostr-tools');
const WebSocket = require('ws');

// Polyfill WebSocket for Node.js environment (Required for nostr-tools v2+)
global.WebSocket = WebSocket;

// 1. กำหนด Relay (เสาสัญญาณที่เราจะตะโกนใส่)
const RELAY_URL = 'wss://relay.damus.io';

async function broadcastJob() {
    console.log(`📡 Connecting to Nostr Relay: ${RELAY_URL}...`);

    try {
        const relay = await Relay.connect(RELAY_URL);
        console.log(`✅ Connected!`);

        // 2. สร้างข้อความประกาศงาน (Event Kind 1)
        const jobContent = JSON.stringify({
            title: "จ้างเขียน FastWoke Protocol",
            budget: "500 Nano",
            description: "ต้องการ Dev สาย Rust/JS เขียนระบบ P2P",
            tags: ["fastwoke", "job", "nano"]
        });

        // 3. สร้าง Event object
        const sk = generateSecretKey(); // กุญแจลับสำหรับเซ็นโพสต์นี้

        const event = {
            kind: 1, // 1 = Text Note (โพสต์ทั่วไป)
            created_at: Math.floor(Date.now() / 1000),
            tags: [['t', 'fastwoke_job_offer']], // Hashtag ให้หาเจอ
            content: `[FASTWOKE JOB OFFER]\n${jobContent}`,
        }

        // เซ็นชื่อกำกับ (Digital Signature)
        const signedEvent = finalizeEvent(event, sk);

        // 4. ส่งขึ้นฟ้า! (Publish)
        console.log(`🚀 Broadcasting Job...`);
        await relay.publish(signedEvent);

        console.log(`\n🎉 Job Published Successfully!`);
        console.log(`🔑 Hex ID: ${signedEvent.id}`);

        // แปลงเป็น NIP-19 (nevent1...) เพื่อให้ njump.me เข้าใจ
        try {
            const nevent = nip19.neventEncode({
                id: signedEvent.id,
                relays: [RELAY_URL],
            });
            console.log(`🌍 ดูโพสต์ของคุณได้ที่: https://njump.me/${nevent}`);
        } catch (encErr) {
            console.error("Error encoding NIP-19:", encErr);
            console.log(`🌍 ดูโพสต์ของคุณได้ที่: https://njump.me/${signedEvent.id}`);
        }

        relay.close();
    } catch (error) {
        console.error("❌ Error broadcasting job:", error);
    }
}

broadcastJob();

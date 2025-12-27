// real_escrow.js
const nano = require('nanocurrency-web');
const sss = require('shamirs-secret-sharing');

// ฟังก์ชันแปลง Buffer <-> Hex
const toBuffer = (str) => Buffer.from(str, 'hex');
const toHex = (buf) => buf.toString('hex');

async function runRealSystem() {
    console.log("💀 STARTING FASTWOKE REAL PROTOCOL (Shamir's Logic)...");

    // 1. [REAL] สร้างกระเป๋า Nano จริงๆ
    const wallet = nano.wallet.generate();
    const originalSeed = wallet.seed;

    console.log(`\n[1] Generated Job Wallet`);
    console.log(`    Address: ${wallet.accounts[0].address}`);
    console.log(`    Seed (Original): ${originalSeed.substring(0, 10)}...[HIDDEN]`);

    // 2. [REAL] หั่นกุญแจด้วยสมการคณิตศาสตร์ (SSS)
    // สังเกต: เราต้องแปลง Seed (Hex) เป็น Buffer ก่อนเข้าสมการ
    const secretBuffer = toBuffer(originalSeed);

    // shares = 2 (แบ่งเป็น 2 ส่วน)
    // threshold = 2 (ต้องใช้ครบ 2 ส่วนถึงจะกู้คืนได้)
    const shares = sss.split(secretBuffer, { shares: 2, threshold: 2 });

    const shareCreditor = toHex(shares[0]);
    const shareDebtor = toHex(shares[1]);

    console.log(`\n[2] Cryptographic Sharding (Mathematical Split)`);
    console.log(`    Shard A (Creditor): ${shareCreditor.substring(0, 20)}...`);
    console.log(`    Shard B (Debtor):   ${shareDebtor.substring(0, 20)}...`);
    console.log(`    ⚠️  สังเกตความยาว: Shard จะยาวกว่า Seed เดิมมาก (ปลอดภัยกว่า)`);

    // ---------------------------------------------------------
    // จำลอง: มารวมร่างกัน
    // ---------------------------------------------------------
    console.log(`\n[3] Reconstructing Keys...`);

    try {
        // รวมร่าง
        const recoveredBuffer = sss.combine([toBuffer(shareCreditor), toBuffer(shareDebtor)]);
        const recoveredSeed = toHex(recoveredBuffer);

        console.log(`    Recovered Seed:  ${recoveredSeed.substring(0, 10)}...`);

        if (originalSeed === recoveredSeed) {
            console.log(`\n✅ MISSION COMPLETE: กู้คืนกุญแจสำเร็จด้วยคณิตศาสตร์!`);
        } else {
            console.log(`\n❌ FAILED: กุญแจผิดพลาด`);
        }
    } catch (error) {
        console.log(`\n❌ ERROR: การรวมกุญแจล้มเหลว`);
    }
}

runRealSystem();

// server.js - จำลอง FastWoke Node
const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nanocurrency-web');
const sss = require('shamirs-secret-sharing');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // จะเสิร์ฟไฟล์หน้าเว็บจากโฟลเดอร์ public

const toBuffer = (str) => Buffer.from(str, 'hex');
const toHex = (buf) => buf.toString('hex');

// 1. API สร้างงาน (Create Job)
app.post('/api/create-job', (req, res) => {
    try {
        console.log("Creating Job Wallet...");
        const wallet = nano.wallet.generate();
        const secret = toBuffer(wallet.seed);

        // หั่นกุญแจ (2-of-2)
        const shares = sss.split(secret, { shares: 2, threshold: 2 });

        res.json({
            address: wallet.accounts[0].address,
            shareCreditor: toHex(shares[0]),
            shareDebtor: toHex(shares[1]),
            originalSeedCheck: wallet.seed // ส่งไปเทสเฉยๆ (ของจริงห้ามส่ง)
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. API ปลดล็อกเงิน (Unlock Funds)
app.post('/api/unlock', (req, res) => {
    try {
        const { shareA, shareB } = req.body;
        console.log("Attempting Unlock...");

        // รวมร่างกุญแจ
        const recovered = sss.combine([toBuffer(shareA), toBuffer(shareB)]);
        const seed = toHex(recovered);

        // กู้คืน Wallet
        const wallet = nano.wallet.fromSeed(seed);

        res.json({
            success: true,
            recoveredSeed: seed,
            address: wallet.accounts[0].address
        });
    } catch (e) {
        res.json({ success: false, error: "กุญแจไม่ถูกต้อง หรือข้อมูลเสียหาย" });
    }
});

app.listen(3000, () => {
    console.log('🚀 FastWoke Web Node running on port 3000');
});

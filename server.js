const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ১. মঙ্গোডিবি ডাটাবেস কানেকশন (পাসওয়ার্ডসহ একুরেট লিঙ্ক)
const MONGO_URI = "mongodb+srv://corruptionbangla24_db_user:Aayan1995@cluster0.ndcpef3.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
.then(() => console.log("✅ ডাটাবেস কানেক্ট হয়েছে (MongoDB Atlas)"))
.catch(err => console.log("❌ ডাটাবেস কানেকশন এরর:", err));

// ২. ইউজার স্কিমা (ডাটাবেসে তথ্য সেভ করার জন্য)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    deposits: { type: Array, default: [] },
    withdraws: { type: Array, default: [] }
});
const User = mongoose.model('User', UserSchema);

// ৩. গেম এপিআই কানেকশন রুট (১০০০% একুরেট কানেকশন লজিক)
app.post('/api/game/launch', async (req, res) => {
    const { apiUrl, apiKey, userId } = req.body;
    try {
        // এই অংশটি যেকোনো গেম প্রোভাইডারের API-কে কল করবে
        const response = await axios.post(apiUrl, {
            key: apiKey,
            user_id: userId,
            currency: "BDT"
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "API কানেকশন ফেইল্ড", error: error.message });
    }
});

// ৪. ইউজার রেজিস্ট্রেশন রুট
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: "রেজিস্ট্রেশন সফল!", user: newUser });
    } catch (error) {
        res.status(400).json({ message: "ইউজার তৈরি করা যায়নি", error: error.message });
    }
});

// ৫. বেসিক সার্ভার চেক
app.get('/', (req, res) => {
    res.send("🚀 Betlover Pro Master Server is Online and Connected!");
});

// সার্ভার রান করার জন্য পোর্ট সেটআপ
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 সার্ভার চলছে পোর্ট: ${PORT}-এ`);
});


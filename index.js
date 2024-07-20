const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
const referralRoutes = require('./routes/referral-route');
app.use('/api/referrals', referralRoutes);

// async function testConnection() {
//     try {
//         const referrals = await prisma.referral.findMany();
//         console.log(referrals);
//     } catch (error) {
//         console.error('Error connecting to database:', error);
//     }
// }

// testConnection();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}..`);
});

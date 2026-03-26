const express = require('express');
const axios = require('axios');

const app = express();

// PORT from environment (important for ECS)
const PORT = process.env.PORT || 3000;

// Backend URL from environment variable
// This is CRITICAL for flexibility across:
// - Local
// - EC2
// - ECS
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// Route for homepage
app.get('/', async (req, res) => {
    try {
        // Call backend API
        const response = await axios.get(`${BACKEND_URL}/api/data`);

        // Send HTML response
        res.send(`
            <h1>Express Frontend 🚀</h1>
            <p>${response.data.message}</p>
        `);
    } catch (error) {
        // Error handling (very important for debugging)
        res.send("❌ Error connecting to backend");
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
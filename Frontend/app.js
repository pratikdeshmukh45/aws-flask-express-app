const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ IMPORTANT: CHANGE THIS AFTER EC2 DEPLOYMENT
const BACKEND_URL = process.env.BACKEND_URL || "http://3.7.254.164:5000";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
    <html>
    <head>
        <title>Message Portal</title>
        <style>
            body {
                font-family: 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #2c3e50, #4ca1af);
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 400px;
                margin: 80px auto;
                background: #fff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                text-align: center;
            }
            h1 {
                margin-bottom: 20px;
                color: #2c3e50;
            }
            input {
                width: 90%;
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
                border: 1px solid #ccc;
                font-size: 14px;
            }
            button {
                width: 95%;
                padding: 12px;
                background: #4ca1af;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
            }
            button:hover {
                background: #357f8a;
            }
            a {
                display: block;
                margin-top: 15px;
                color: #4ca1af;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Message Portal</h1>
            <form method="POST" action="/submit">
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="text" name="message" placeholder="Your Message" required />
                <button type="submit">Submit Message</button>
            </form>
            <a href="/messages">View Messages</a>
        </div>
    </body>
    </html>
    `);
});

app.post('/submit', async (req, res) => {
    try {
        await axios.post(`${BACKEND_URL}/api/data`, {
            name: req.body.name,
            message: req.body.message
        });

        res.redirect('/messages');
    } catch (error) {
        console.error(error.message);
        res.send("Error communicating with backend");
    }
});

app.get('/messages', async (req, res) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/data`);
        const messages = response.data;

        let list = messages.map(m => `
            <li><strong>${m.name}</strong><br>${m.message}</li>
        `).join("");

        res.send(`
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', sans-serif;
                    background: #f4f6f9;
                    text-align: center;
                }
                ul {
                    list-style: none;
                    padding: 0;
                }
                li {
                    background: white;
                    margin: 10px auto;
                    padding: 15px;
                    width: 350px;
                    border-radius: 8px;
                    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                }
                a {
                    display: block;
                    margin-top: 20px;
                    text-decoration: none;
                    color: #4ca1af;
                }
            </style>
        </head>
        <body>
            <h1>Messages</h1>
            <ul>${list}</ul>
            <a href="/">Back to Home</a>
        </body>
        </html>
        `);
    } catch (error) {
        res.send("Error fetching messages");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend running on port ${PORT}`);
});
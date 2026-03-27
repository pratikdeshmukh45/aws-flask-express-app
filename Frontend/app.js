const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Home page with form
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Flask-Express App</title>
            <style>
                body {
                    font-family: Arial;
                    background: #f4f4f4;
                    text-align: center;
                    padding: 50px;
                }
                form {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    display: inline-block;
                }
                input {
                    margin: 10px;
                    padding: 10px;
                    width: 200px;
                }
                button {
                    padding: 10px 20px;
                    background: #007BFF;
                    color: white;
                    border: none;
                    border-radius: 5px;
                }
                a {
                    display: block;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <h1>🚀 Flask + Express App</h1>
            <form method="POST" action="/submit">
                <input type="text" name="name" placeholder="Enter Name" required><br>
                <input type="text" name="message" placeholder="Enter Message" required><br>
                <button type="submit">Submit</button>
            </form>

            <a href="/messages">View Messages</a>
        </body>
        </html>
    `);
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        await axios.post(`${BACKEND_URL}/api/data`, {
            name: req.body.name,
            message: req.body.message
        });

        res.redirect('/messages');
    } catch (error) {
        res.send("❌ Error sending data to backend");
    }
});

// Show all messages
app.get('/messages', async (req, res) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/data`);
        const messages = response.data;

        let messageList = messages.map(m => `
            <li><b>${m.name}</b>: ${m.message}</li>
        `).join("");

        res.send(`
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial;
                        text-align: center;
                        background: #f4f4f4;
                    }
                    ul {
                        list-style: none;
                        padding: 0;
                    }
                    li {
                        background: white;
                        margin: 10px auto;
                        padding: 10px;
                        width: 300px;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <h1>📩 Messages</h1>
                <ul>${messageList}</ul>
                <a href="/">⬅ Back</a>
            </body>
            </html>
        `);
    } catch (error) {
        res.send("❌ Error fetching data");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

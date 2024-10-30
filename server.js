require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://www.ytvideo.free.nf/oauth2callback'
);

const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

app.get('/auth', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets']
    });
    res.redirect(url);
});

app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    process.env.GOOGLE_REFRESH_TOKEN = tokens.refresh_token;
    res.send('Authentication successful! You can close this window.');
});

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'Sheet1!A:A',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [[email]]
            }
        });
        res.json({ message: 'Subscribed successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Subscription failed. Please try again.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

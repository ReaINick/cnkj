const express = require('express');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up OAuth 2.0 client
const oauth2Client = new OAuth2Client(
    '853592900484-hm2rjb8h8unl49svj2onbmgaetjq33p6.apps.googleusercontent.com',
    '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',
    'https://www.ytvideo.free.nf/'
);

// Set up Google Sheets API
const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    
    try {
        // Append email to Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: 'YOUR_SPREADSHEET_ID',
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

const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new OAuth2Client(
    '853592900484-hm2rjb8h8unl49svj2onbmgaetjq33p6.apps.googleusercontent.com',
    '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',
    'https://www.ytvideo.free.nf/oauth2callback'
);

const scopes = [
    'https://www.googleapis.com/auth/spreadsheets'
];

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

console.log('Authorize this app by visiting this url:', url);

const { tokens } = await oauth2Client.getToken(code);
console.log(tokens.refresh_token);

oauth2Client.setCredentials({
    refresh_token: 'YOUR_REFRESH_TOKEN'
});


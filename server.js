const express = require('express');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up OAuth 2.0 client
const oauth2Client = new OAuth2Client(
    'YOUR_CLIENT_ID',
    'YOUR_CLIENT_SECRET',
    'YOUR_REDIRECT_URI'
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

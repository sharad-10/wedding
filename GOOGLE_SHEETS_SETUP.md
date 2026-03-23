## Google Sheets RSVP Setup

### 1. Create the sheet

Create a Google Sheet with these headers in row 1:

`submittedAt | name | phone | attendance | dance | guestCount | note`

### 2. Open Apps Script

From the Google Sheet:

`Extensions -> Apps Script`

Replace the default code with:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || "",
    data.name || "",
    data.phone || "",
    data.attendance || "",
    data.dance || "",
    data.guestCount || "",
    data.note || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 3. Deploy the script

1. Click `Deploy`
2. Choose `New deployment`
3. Select `Web app`
4. Set `Who has access` to `Anyone`
5. Click `Deploy`
6. Copy the web app URL

### 4. Connect it to the website

Create a `.env` file in the project root with:

```bash
VITE_GOOGLE_SCRIPT_URL=PASTE_YOUR_WEB_APP_URL_HERE
```

### 5. Restart the site

After saving `.env`, restart the dev server:

```bash
npm run dev
```

### Notes

- Each RSVP submission will create one new row in your Google Sheet.
- If you redeploy Apps Script, update the `.env` URL if it changes.
- Google Apps Script may take a few seconds to respond the first time.

BRANDIX F1 SCORING & LEADERBOARD 2026

FILES
- index.html: Local website. Open this file in Chrome/Edge.
- Google-Sheets-Backend.gs: Google Apps Script backend for Google Sheets.

GOOGLE SHEETS SETUP
1. Create a new Google Spreadsheet.
2. Open Extensions > Apps Script from that spreadsheet.
3. Replace the editor contents with Google-Sheets-Backend.gs.
4. Save the project.
5. Deploy > New deployment > Web app.
6. Execute as: Me.
7. Who has access: Anyone (or your organization's approved access setting).
8. Deploy and complete Google's authorization prompts.
9. Copy the Web app URL ending in /exec.
10. Open index.html, open its Google Sheets settings, paste the URL, and save/connect.

IMPORTANT
- The website can run locally; it does not need web hosting.
- Google Sheets syncing will work only after the Apps Script is deployed and its URL is configured in the website.
- Use an access policy appropriate for your company. A publicly accessible Apps Script endpoint should not be treated as secure authentication.
- Keep a backup of the spreadsheet and test adding/editing/deleting a sample participant before the event.

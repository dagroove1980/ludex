# ✅ Verify Spreadsheet ID

## Current Error
The logs show it's trying to use: `1_eP6VUevK_03cXHYAWu...`

## Steps to Fix

### 1. Get the Correct Spreadsheet ID

1. Open your Google Sheet (the "Ludex" sheet)
2. Look at the URL in your browser address bar
3. It should look like:
   ```
   https://docs.google.com/spreadsheets/d/1_eP6VUevK_03cXHYAWu.../edit
   ```
4. Copy the **entire** ID (the long string between `/d/` and `/edit`)
   - Make sure you get the FULL ID, not just the beginning

### 2. Verify the ID in Vercel

1. Go to: **Vercel Dashboard → Settings → Environment Variables**
2. Find `GOOGLE_SHEETS_ID` for **Production**
3. Click to view/edit it
4. Compare it with the ID from your Google Sheet URL
5. They must match **exactly** (including any underscores, dashes, etc.)

### 3. Common Issues

- **Truncated ID**: The ID might be cut off in Vercel
- **Extra spaces**: There might be leading/trailing spaces
- **Wrong environment**: Make sure it's set for **Production** (not just Development)

### 4. Update if Needed

If the ID doesn't match:
1. Copy the **full** ID from your Google Sheet URL
2. Update `GOOGLE_SHEETS_ID` in Vercel (Production)
3. Make sure there are **no spaces** before or after
4. Save

### 5. Verify Service Account Access

Even with the correct ID, make sure:
1. The service account email has **Editor** access to the sheet
2. The service account email is: `ludex-567@ludex-482617.iam.gserviceaccount.com`
3. It's listed in the "People with access" section with "Editor" permission

### 6. Test

After updating:
1. Vercel will auto-redeploy
2. Wait 1-2 minutes
3. Try accessing `/api/games` again
4. Check logs - you should see:
   - `Fetching games from spreadsheet: [full ID]...`
   - `Available sheets: games, conversations`

## Quick Check

To verify the spreadsheet ID is accessible:
1. Open your Google Sheet
2. Check the URL - the ID should be visible
3. Make sure the service account can access it (check Share settings)


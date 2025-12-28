# 🔧 Fix "Requested entity was not found" Error

## Error
```
Error: Requested entity was not found.
```

This is a Google Sheets API error that means the spreadsheet or sheet tab cannot be found.

## Possible Causes

### 1. Wrong Spreadsheet ID
The `GOOGLE_SHEETS_ID` in Vercel might not match your actual spreadsheet.

**How to find the correct Spreadsheet ID:**
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
2. The ID is the long string between `/d/` and `/edit`
3. Example: `https://docs.google.com/spreadsheets/d/1_eP6VUevK_03cXHYAWu.../edit`
   - The ID is: `1_eP6VUevK_03cXHYAWu...`

**Fix:**
1. Go to: **Vercel Dashboard → Settings → Environment Variables**
2. Find `GOOGLE_SHEETS_ID`
3. Update it with the correct ID from your Google Sheet URL
4. Make sure it's set for **Production** environment

### 2. Sheet Tab Name Mismatch
The code looks for a sheet tab named `games`, but it might be named differently.

**Check:**
1. Open your Google Sheet
2. Look at the bottom tabs
3. Make sure there's a tab named exactly `games` (lowercase, no spaces)

**Fix:**
- If the tab is named differently (e.g., "Games", "GAMES", "game"), either:
  - Rename the tab to `games` in Google Sheets, OR
  - Update the code to use the correct tab name

### 3. Service Account Permissions
Even though you shared the sheet, the service account might not have access.

**Verify:**
1. Check the service account email (from your service account JSON)
2. Go to your Google Sheet → Share
3. Make sure the service account email is listed with **Editor** access

### 4. Spreadsheet Deleted or Moved
The spreadsheet might have been deleted or moved to a different Google account.

**Check:**
1. Try opening the spreadsheet URL directly
2. Make sure it's accessible

## After Fixing

1. **Redeploy** (Vercel will auto-redeploy when you change env vars)
2. **Check logs** again - the improved error handling will show:
   - The spreadsheet ID being used
   - Available sheet names
   - More specific error messages

## Quick Test

After updating the spreadsheet ID, check the Vercel logs again. You should see:
- `Fetching games from spreadsheet: ...`
- `Available sheets: games, conversations`

If you see different sheet names, that's the issue!


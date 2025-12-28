# 🔍 Debug 500 Errors

## Errors
- `/api/games` → 500 Internal Server Error
- `/api/upload` → 500 Internal Server Error

## Most Likely Causes

### 1. Missing Vercel Blob Storage (for uploads)
- **Error**: Upload fails because `BLOB_READ_WRITE_TOKEN` is missing
- **Fix**: Create Blob store in Vercel Dashboard → Storage

### 2. Google Sheets API Issues (for /api/games)
- **Error**: Service account key parsing fails
- **Error**: Sheets don't exist or wrong structure
- **Error**: Service account doesn't have permissions

## Check Vercel Logs

1. Go to: **Vercel Dashboard → Deployments**
2. Click on latest deployment
3. Go to **"Logs"** tab
4. Look for errors related to:
   - `GOOGLE_SERVICE_ACCOUNT_KEY`
   - `BLOB_READ_WRITE_TOKEN`
   - `spreadsheets.values.get`
   - `@vercel/blob`

## Quick Fixes

### Fix Upload (Blob Storage)
1. **Vercel Dashboard → Storage**
2. **Create Database → Blob**
3. Name it and create
4. Token will be auto-added

### Fix Games API (Google Sheets)
1. **Check service account key** is valid JSON
2. **Verify sheet exists** with correct structure
3. **Check service account** has Editor access to sheet

## Check Browser Console

Open browser DevTools (F12) → Console tab and look for the actual error message. It might show more details than just "500".

## Next Steps

After checking logs, we can fix the specific issue. The improved error handling I just added will show better error messages in the logs.


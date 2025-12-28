# 🔧 Fix Runtime 500 Errors

## ✅ Build Status
Your build completed successfully! The 500 errors are **runtime errors**, not build errors.

## Most Likely Causes

### 1. Missing BLOB_READ_WRITE_TOKEN (for `/api/upload`)

The upload route uses `@vercel/blob` which requires a Blob store to be created first.

**Fix:**
1. Go to: **Vercel Dashboard → Your Project → Storage**
2. Click **"Create Database"** or **"Add Storage"**
3. Select **"Blob"**
4. Name it (e.g., "ludex-storage")
5. Click **"Create"**
6. The `BLOB_READ_WRITE_TOKEN` will be automatically added

### 2. Google Sheets API Runtime Error (for `/api/games`)

Even though the build shows credentials are set, runtime errors can occur if:
- Service account doesn't have Editor access to the sheet
- Sheet doesn't have a "games" tab
- Sheet structure is incorrect

**Fix:**
1. Verify service account email has Editor access to your Google Sheet
2. Check that the sheet has a "games" tab with correct columns
3. Check runtime logs (see below) for specific error

## Check Runtime Logs

The build logs show the build succeeded. To see **runtime errors**:

1. Go to: **Vercel Dashboard → Deployments**
2. Click on your latest deployment
3. Go to **"Functions"** tab
4. Click on `/api/games` or `/api/upload`
5. Check the **"Logs"** tab for runtime errors

Or use the Vercel CLI:
```bash
vercel logs --follow
```

## What to Look For

In the runtime logs, look for:
- `BLOB_READ_WRITE_TOKEN` missing errors
- `GOOGLE_SERVICE_ACCOUNT_KEY` parsing errors
- `spreadsheets.values.get` permission errors
- `@vercel/blob` initialization errors

## After Fixing Blob Storage

Once you create the Blob store:
1. Vercel will auto-redeploy (or manually redeploy)
2. Try uploading again
3. The `/api/upload` error should be resolved

## Test After Fixes

1. **Test `/api/games`**: Should return `{ games: [] }` if no games yet
2. **Test `/api/upload`**: Should accept PDF uploads after Blob storage is set up

The improved error handling I added will show clearer error messages in the runtime logs!


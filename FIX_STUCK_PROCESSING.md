# 🔧 Fix Stuck "Processing" Status

## Problem
Games are stuck on "processing" status and never complete.

## Possible Causes

### 1. Processing Endpoint Not Being Called
The async `fetch` call from `/api/upload` might be failing silently.

**Check Vercel Logs:**
1. Go to: **Vercel Dashboard → Deployments → Latest → Functions**
2. Click on `/api/process`
3. Check **Logs** tab
4. Look for:
   - "Processing request received"
   - "Processing game: [gameId]"
   - Any error messages

### 2. Missing GEMINI_API_KEY
The API key might not be set for Production.

**Check:**
1. **Vercel Dashboard → Settings → Environment Variables**
2. Verify `GEMINI_API_KEY` is set for **Production**
3. Make sure it's the full key (starts with `AIza...`)

### 3. Vercel Function Timeout
Vercel Hobby plan has a **10-second timeout**. Processing might be taking longer.

**Solution:** Upgrade to Pro plan (300s timeout) or optimize processing.

### 4. PDF Download Failing
The PDF might not be accessible from Blob storage.

**Check logs** for "Downloading PDF from:" messages.

## Quick Fix: Manually Trigger Processing

If games are stuck, you can manually trigger processing:

### Option 1: Use Browser Console

1. Open your app in browser
2. Open DevTools (F12) → Console
3. Run:
```javascript
fetch('/api/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ gameId: 'YOUR_GAME_ID_HERE' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Replace `YOUR_GAME_ID_HERE` with the actual game ID from the URL or game card.

### Option 2: Check Game Status in Sheets

1. Open your Google Sheet
2. Find the game row
3. Check the `status` column
4. If it's "error", check the `errorMessage` column

### Option 3: Re-upload

If processing is completely stuck:
1. Delete the stuck game
2. Re-upload the PDF
3. Monitor the logs this time

## After Fixing

The improved logging I just added will show:
- When processing starts
- Each step (download, extract, AI, update)
- Any errors with full details

Check the Vercel logs after the next deployment to see exactly where it's failing.


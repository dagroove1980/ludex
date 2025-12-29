# 📋 How to Check Vercel Logs

## Method 1: Logs Tab (Easiest)

1. In the **Deployment Details** page, click the **"Logs"** tab (next to "Deployment")
2. This shows all logs for this deployment
3. Look for entries related to `/api/process`
4. Filter by searching for "OpenAI" or "Processing"

## Method 2: Runtime Logs

1. Scroll down to the bottom of the deployment page
2. Look for **"Runtime Logs"** section
3. Click to expand it
4. This shows real-time function execution logs

## Method 3: Vercel CLI (Most Detailed)

Run this in your terminal:

```bash
cd /Users/david.scebat/Documents/ludex
vercel logs --follow
```

This will show live logs from your deployment.

## Method 4: Check Function Logs Directly

1. Go to: **Vercel Dashboard → Your Project → Settings → Functions**
2. Or go to: **Vercel Dashboard → Your Project → Logs**
3. Filter by function name: `/api/process`

## What to Look For

In the logs, search for:
- `"Calling OpenAI API..."`
- `"API Key present: true/false"`
- `"OpenAI API attempt 1/3"`
- `"Connection error"`
- Any error messages with stack traces

## Quick Test: Trigger Processing and Watch Logs

1. Open the **Logs** tab in Vercel
2. In your browser, trigger processing again:
```javascript
fetch('/api/games')
  .then(r => r.json())
  .then(data => {
    const game = data.games[0];
    fetch('/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: game.gameId })
    });
  });
```
3. Watch the logs tab in real-time to see what happens


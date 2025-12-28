# ✅ Update Spreadsheet ID in Vercel

## Spreadsheet ID
```
1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA
```

## Steps to Update

### Option 1: Vercel Dashboard (Recommended)

1. Go to: **Vercel Dashboard → Your `ludex` project → Settings → Environment Variables**
2. Find `GOOGLE_SHEETS_ID` for **Production**
3. Click the **three dots (⋯)** menu → **Edit**
4. Replace the value with:
   ```
   1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA
   ```
5. Make sure there are **no spaces** before or after
6. Click **Save**

### Option 2: Update via CLI (if you prefer)

```bash
cd /Users/david.scebat/Documents/ludex

# Remove old value (will ask for confirmation - type 'y')
vercel env rm GOOGLE_SHEETS_ID production

# Add new value
echo -n "1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA" | vercel env add GOOGLE_SHEETS_ID production
```

## Also Update Preview Environment

Do the same for **Preview** environment:
1. Find `GOOGLE_SHEETS_ID` for **Preview**
2. Update it with the same ID: `1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA`

## After Updating

1. Vercel will **auto-redeploy** when you change environment variables
2. Wait 1-2 minutes for deployment
3. Try accessing the app again
4. Check logs - you should see:
   - `Fetching games from spreadsheet: 1_eP6VUevK_03cXHYAWu...`
   - `Available sheets: games, conversations`

## Verify

After updating, the error should be resolved and `/api/games` should return `{ games: [] }` (empty array if no games yet).


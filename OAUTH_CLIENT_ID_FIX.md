# 🔧 Fix OAuth Client ID with Newline Issue

## Problem
The client ID in the error URL ends with `%0A` (URL-encoded newline):
```
client_id=247399756758-0n1m2r9p6r9et38dl8sa6tvnv9khhr1s.apps.googleusercontent.com%0A
```

This means the `GOOGLE_CLIENT_ID` environment variable has a trailing newline or whitespace.

## Fix Steps

### Option 1: Update in Vercel Dashboard (Recommended)

1. Go to: **Vercel Dashboard → Settings → Environment Variables**
2. Find `GOOGLE_CLIENT_ID` for **Production**
3. Click to edit it
4. **Remove any trailing spaces or newlines**
5. Make sure it's exactly:
   ```
   247399756758-0n1m2r9p6r9et38dl8sa6tvnv9khhr1s.apps.googleusercontent.com
   ```
6. **No spaces before or after**
7. Click **Save**

### Option 2: Update via CLI

```bash
cd /Users/david.scebat/Documents/ludex

# Remove the old one
vercel env rm GOOGLE_CLIENT_ID production

# Add it again (clean, no newlines)
echo -n "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com" | vercel env add GOOGLE_CLIENT_ID production
```

### Also Check GOOGLE_CLIENT_SECRET

Make sure `GOOGLE_CLIENT_SECRET` also has no trailing whitespace:
   ```
   YOUR_CLIENT_SECRET_HERE
   ```

## After Fixing

1. **Redeploy** (Vercel will auto-redeploy when you change env vars)
2. **Wait 1-2 minutes** for deployment
3. **Try signing in again**

## Verify in Google Cloud Console

Also double-check in Google Cloud Console:
1. Go to: **APIs & Services → Credentials**
2. Find your OAuth 2.0 Client ID
3. Make sure the **Client ID** matches exactly (no spaces):
   ```
   247399756758-0n1m2r9p6r9et38dl8sa6tvnv9khhr1s.apps.googleusercontent.com
   ```
4. Verify **Authorized redirect URIs** includes:
   ```
   https://ludex-iota.vercel.app/api/auth/callback/google
   ```

The trailing newline (`%0A`) is causing Google to not recognize the client ID. Once removed, it should work!


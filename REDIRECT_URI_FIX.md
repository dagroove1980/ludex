# 🔧 Fix OAuth Redirect URI Mismatch

## Error
```
Error 400: redirect_uri_mismatch
```

## Problem
The redirect URI your app is sending doesn't match what's configured in Google Cloud Console.

## Fix: Add Redirect URI to Google Cloud Console

### Step 1: Find Your Production Domain
Your production domain is likely one of:
- `https://ludex-iota.vercel.app`
- `https://ludex-davids-projects-794668e3.vercel.app`

### Step 2: Add Redirect URI

1. Go to: https://console.cloud.google.com
2. Select your project (where the OAuth client was created)
3. Go to: **APIs & Services → Credentials**
4. Click on your OAuth 2.0 Client ID (`247399756758-0n1m2r9p6r9et38dl8sa6tvnv9khhr1s.apps.googleusercontent.com`)
5. Under **"Authorized redirect URIs"**, click **"+ ADD URI"**
6. Add **exactly** (replace with your actual domain):
   ```
   https://ludex-iota.vercel.app/api/auth/callback/google
   ```
   Or if that's not your domain:
   ```
   https://ludex-davids-projects-794668e3.vercel.app/api/auth/callback/google
   ```
7. **Important**: Must match exactly:
   - `https://` (not `http://`)
   - Your exact domain
   - `/api/auth/callback/google` path
8. Click **"SAVE"**

### Step 3: Also Add Preview/Development URIs (Optional)

For testing, you can also add:
- `http://localhost:3000/api/auth/callback/google` (for local dev)
- Preview deployment URLs (if you want to test previews)

### Step 4: Verify NEXTAUTH_URL

Make sure `NEXTAUTH_URL` in Vercel matches your production domain:
- Go to: **Vercel Dashboard → Settings → Environment Variables**
- Find `NEXTAUTH_URL` for Production
- Should be: `https://ludex-iota.vercel.app` (or your actual domain)

## After Adding Redirect URI

1. **Wait 1-2 minutes** for Google's changes to propagate
2. **Try signing in again**
3. Should work now!

## Common Mistakes

- ❌ Missing `https://`
- ❌ Wrong domain
- ❌ Missing `/api/auth/callback/google` path
- ❌ Extra trailing slash
- ❌ Using `http://` instead of `https://`

Make sure the redirect URI in Google Console matches **exactly** what NextAuth is sending!


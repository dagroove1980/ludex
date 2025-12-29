# ✅ OAuth Redirect URI Update Instructions

## What Was Done

✅ **Updated `NEXTAUTH_URL` in Vercel** to: `https://ludex-iota.vercel.app`

## What You Need to Do

Unfortunately, updating OAuth redirect URIs via CLI is not straightforward - it requires complex API calls. The easiest way is through the Google Cloud Console web UI.

### Quick Steps:

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials?project=ludex-482617

2. **Find Your OAuth Client:**
   - Look for OAuth 2.0 Client ID: `247399756758-0n1m2r9p6r9et38dl8sa6tvnv9khhr1s.apps.googleusercontent.com`
   - Click on it

3. **Add Redirect URI:**
   - Scroll to **"Authorized redirect URIs"** section
   - Click **"ADD URI"**
   - Add: `https://ludex-iota.vercel.app/api/auth/callback/google`
   - Click **"SAVE"**

4. **Redeploy in Vercel:**
   - Go to Vercel Dashboard → Deployments
   - Click **"Redeploy"** on latest deployment
   - Or wait for next auto-deploy

## Verify It's Fixed

After updating and redeploying:
1. Go to https://ludex-iota.vercel.app
2. Click "Sign in with Google"
3. Should work without redirect_uri_mismatch error

---

**Note:** The `NEXTAUTH_URL` environment variable has been updated in Vercel. You just need to add the redirect URI in Google Cloud Console and redeploy.


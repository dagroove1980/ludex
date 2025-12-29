# 🔧 Fix OAuth Redirect URI Mismatch Error

## Problem
```
Error 400: redirect_uri_mismatch
Access blocked: This app's request is invalid
```

## Root Cause
The `NEXTAUTH_URL` environment variable in Vercel doesn't match your actual deployment URL, OR the redirect URI isn't registered in Google Cloud Console.

## Quick Fix Steps

### Step 1: Find Your Actual Vercel URL
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **ludex** project
3. Check the **Domains** section or look at your latest deployment URL
4. It should be something like: `https://ludex-xxxxx.vercel.app` or `https://ludex.vercel.app`

### Step 2: Update NEXTAUTH_URL in Vercel
1. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `NEXTAUTH_URL`
3. **Update it** to match your actual Vercel URL:
   - Example: `https://ludex-xxxxx.vercel.app` (no trailing slash)
   - Make sure it's set for **Production** environment
4. If it doesn't exist, **add it**:
   - Name: `NEXTAUTH_URL`
   - Value: `https://your-actual-vercel-url.vercel.app`
   - Environments: ✅ Production, ✅ Preview

### Step 3: Update Google OAuth Redirect URI
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (ludex-482617)
3. Go to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**
5. Under **Authorized redirect URIs**, make sure you have:
   - `https://your-actual-vercel-url.vercel.app/api/auth/callback/google`
   - Replace `your-actual-vercel-url.vercel.app` with your actual Vercel domain
6. Click **Save**

### Step 4: Redeploy
1. In Vercel Dashboard → **Deployments**
2. Click **"Redeploy"** on your latest deployment
3. Or make a small change and push to trigger auto-deploy

## Verify It's Fixed

After redeploying, test:
1. Go to your Vercel URL
2. Click "Sign in with Google"
3. Should redirect properly without the error

## Common Issues

### Issue: Multiple Vercel URLs
If you have multiple URLs (e.g., preview deployments), you need to:
- Add each URL to Google OAuth redirect URIs
- Or use a wildcard domain if supported

### Issue: URL has trailing slash
Make sure `NEXTAUTH_URL` does NOT have a trailing slash:
- ✅ Correct: `https://ludex.vercel.app`
- ❌ Wrong: `https://ludex.vercel.app/`

### Issue: Preview deployments
For preview deployments, you might need to:
- Add the preview URL to Google OAuth redirect URIs
- Or set `NEXTAUTH_URL` dynamically based on the deployment URL

## Still Not Working?

Check:
1. ✅ `NEXTAUTH_URL` matches your actual Vercel domain exactly
2. ✅ Google OAuth redirect URI matches: `{NEXTAUTH_URL}/api/auth/callback/google`
3. ✅ Environment variable is set for Production environment
4. ✅ You've redeployed after making changes
5. ✅ No typos in the URLs

---

**The code itself is fine - this is purely an environment variable configuration issue.**


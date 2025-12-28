# 🔍 OAuth/NextAuth Configuration Check

## Required Environment Variables

NextAuth requires these to work:

1. **NEXTAUTH_SECRET** ✅ (should be set)
2. **NEXTAUTH_URL** ⚠️ (needs to match your production domain)
3. **GOOGLE_CLIENT_ID** ✅ (should be set)
4. **GOOGLE_CLIENT_SECRET** ✅ (should be set)

## Potential Issue

If `NEXTAUTH_URL` is wrong or missing, NextAuth might fail to initialize, which could cause:
- App crashes on load
- Routing issues
- 404 errors

## Check in Vercel Dashboard

1. Go to: **Settings** → **Environment Variables**
2. Verify these are set for **Production**:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` = `https://ludex-iota.vercel.app` (or your production URL)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## Fix NEXTAUTH_URL

If `NEXTAUTH_URL` is wrong or missing:

1. **Get your production URL**:
   - Check Vercel Dashboard → Deployments
   - Use: `https://ludex-iota.vercel.app` or `https://ludex-davids-projects-794668e3.vercel.app`

2. **Update the variable**:
   - Go to Environment Variables
   - Find `NEXTAUTH_URL`
   - Update to your actual production URL
   - Save

3. **Redeploy** (should happen automatically)

## Also Check Google OAuth Redirect URI

In Google Cloud Console:
1. Go to: APIs & Services → Credentials
2. Click your OAuth 2.0 Client ID
3. Add authorized redirect URI:
   - `https://ludex-iota.vercel.app/api/auth/callback/google`
   - Or your actual production URL + `/api/auth/callback/google`

## Test

After fixing `NEXTAUTH_URL`:
1. Wait for redeploy
2. Try accessing: `https://ludex-iota.vercel.app`
3. Should load (even if auth doesn't work yet)

The 404 is likely still the framework detection issue, but fixing `NEXTAUTH_URL` is important for auth to work!


# 🔧 Fix Google OAuth Error 401: invalid_client

## Error
```
Access blocked: Authorization Error
Error 401: invalid_client
The OAuth client was not found.
```

## Root Cause
The Google OAuth client ID/secret don't match, or the redirect URI isn't configured in Google Cloud Console.

## Fix Steps

### 1. Verify Environment Variables in Vercel

Go to: **Vercel Dashboard → Settings → Environment Variables**

Check these are set correctly for **Production**:
- `GOOGLE_CLIENT_ID` = `YOUR_CLIENT_ID_HERE.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET` = `YOUR_CLIENT_SECRET_HERE`

### 2. Add Redirect URI to Google Cloud Console

1. Go to: https://console.cloud.google.com
2. Select your project (or create one)
3. Go to: **APIs & Services → Credentials**
4. Click on your OAuth 2.0 Client ID (`247399756758-...`)
5. Under **Authorized redirect URIs**, add:
   ```
   https://ludex-iota.vercel.app/api/auth/callback/google
   ```
   Or your actual production URL:
   ```
   https://ludex-davids-projects-794668e3.vercel.app/api/auth/callback/google
   ```
6. Click **Save**

### 3. Verify OAuth Consent Screen

1. In Google Cloud Console, go to: **APIs & Services → OAuth consent screen**
2. Make sure:
   - User Type is set (Internal or External)
   - App name is set
   - Support email is set
   - Scopes include: `email`, `profile`, `openid`

### 4. Check NEXTAUTH_URL

Make sure `NEXTAUTH_URL` in Vercel matches your production domain:
- `https://ludex-iota.vercel.app` (or your actual domain)

### 5. Redeploy

After making changes:
- Vercel will auto-redeploy if you change env vars
- Or manually trigger: Vercel Dashboard → Deployments → Redeploy

## Quick Test

After fixing, try signing in again. The error should be resolved!

## Common Issues

- **Wrong Client ID**: Make sure it matches exactly (no extra spaces)
- **Redirect URI mismatch**: Must match exactly, including `https://` and `/api/auth/callback/google`
- **OAuth consent screen not configured**: Must have at least basic info filled in


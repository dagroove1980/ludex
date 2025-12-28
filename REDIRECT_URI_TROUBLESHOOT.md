# 🔍 Redirect URI Troubleshooting

## Current Configuration
- ✅ Redirect URI in Google Console: `https://ludex-iota.vercel.app/api/auth/callback/google`
- ✅ NEXTAUTH_URL in Vercel: `https://ludex-iota.vercel.app`

## Still Getting redirect_uri_mismatch?

### Possible Causes:

1. **Google Propagation Delay**
   - Google says: "It may take five minutes to a few hours for settings to take effect"
   - **Wait 5-10 minutes** and try again

2. **Multiple Domains**
   - Vercel uses multiple domains (preview, git-main, etc.)
   - You might be accessing a different domain than `ludex-iota.vercel.app`
   - **Check which URL you're actually using** when signing in

3. **NEXTAUTH_URL Mismatch**
   - Make sure `NEXTAUTH_URL` matches the domain you're accessing
   - If you access `ludex-davids-projects-794668e3.vercel.app`, NEXTAUTH_URL should match

### Solutions:

#### Option 1: Add All Vercel Domains to Google Console
Add these redirect URIs in Google Cloud Console:
- `https://ludex-iota.vercel.app/api/auth/callback/google` ✅ (already added)
- `https://ludex-davids-projects-794668e3.vercel.app/api/auth/callback/google`
- `https://ludex-git-main-davids-projects-794668e3.vercel.app/api/auth/callback/google`

#### Option 2: Wait for Propagation
- Wait 5-10 minutes
- Try signing in again
- Google's changes can take time to propagate

#### Option 3: Check Which Domain You're Using
- When you click "Sign in", check the browser URL
- Make sure that domain is in Google Console's redirect URIs

### Quick Test:
1. **Check the exact URL** when you click "Sign in with Google"
2. **Verify that URL** is in Google Console's authorized redirect URIs
3. **Wait 5-10 minutes** if you just added it

The redirect URI looks correct - it might just need time to propagate!


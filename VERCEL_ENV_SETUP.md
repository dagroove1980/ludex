# 🔐 Vercel Environment Variables Setup

## Quick Setup Guide

Your credentials are ready! Here's how to add them to Vercel:

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Click on your **ludex** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Each Variable

Add these variables one by one (click "Add New" for each):

#### 1. Google Sheets ID
- **Name**: `GOOGLE_SHEETS_ID`
- **Value**: `1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 2. Google Service Account Key
- **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
- **Value**: (Paste the full JSON from `ludex-482617-85c4fd00adfb.json`)
  ```
  {"type":"service_account","project_id":"ludex-482617",...}
  ```
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Important**: Paste the entire JSON as a single line (no line breaks)

#### 3. Google OAuth Client ID
- **Name**: `GOOGLE_CLIENT_ID`
- **Value**: (your OAuth client ID from Google Cloud Console)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 4. Google OAuth Client Secret
- **Name**: `GOOGLE_CLIENT_SECRET`
- **Value**: (your OAuth client secret from Google Cloud Console)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 5. NextAuth Secret
- **Name**: `NEXTAUTH_SECRET`
- **Value**: `5I2t8f2qktF0FEDRfZaS438GhBaAVjiPnjkMhLOnKbk=`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 6. NextAuth URL (Update after first deploy)
- **Name**: `NEXTAUTH_URL`
- **Value**: `https://your-domain.vercel.app` (replace with your actual Vercel URL)
- **Environments**: ✅ Production, ✅ Preview
- **Development**: `http://localhost:3000`

#### 7. Gemini API Key
- **Name**: `GEMINI_API_KEY`
- **Value**: `AIzaSyBnxqFbVePFCcuoFF0WjZNBn8lRpNWo8LA`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 8. App URL (Update after first deploy)
- **Name**: `NEXT_PUBLIC_APP_URL`
- **Value**: `https://your-domain.vercel.app` (replace with your actual Vercel URL)
- **Environments**: ✅ Production, ✅ Preview
- **Development**: `http://localhost:3000`

### Step 3: Update OAuth Redirect URIs

After your first deployment, update the OAuth redirect URIs:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Add authorized redirect URI:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - (Replace `your-domain.vercel.app` with your actual Vercel domain)

### Step 4: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the **"Redeploy"** button on your latest deployment
3. Or push a new commit to trigger auto-deployment

## Quick Copy-Paste Checklist

Use this checklist to make sure you add everything:

- [ ] `GOOGLE_SHEETS_ID` = `1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA`
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` = (full JSON from service account file)
- [ ] `GOOGLE_CLIENT_ID` = (your OAuth client ID)
- [ ] `GOOGLE_CLIENT_SECRET` = (your OAuth client secret)
- [ ] `NEXTAUTH_SECRET` = `5I2t8f2qktF0FEDRfZaS438GhBaAVjiPnjkMhLOnKbk=`
- [ ] `NEXTAUTH_URL` = (your Vercel URL after first deploy)
- [ ] `GEMINI_API_KEY` = `AIzaSyBnxqFbVePFCcuoFF0WjZNBn8lRpNWo8LA`
- [ ] `NEXT_PUBLIC_APP_URL` = (your Vercel URL after first deploy)

## Important Notes

⚠️ **After First Deploy:**
- Update `NEXTAUTH_URL` with your actual Vercel domain
- Update `NEXT_PUBLIC_APP_URL` with your actual Vercel domain
- Add the production callback URL to Google OAuth settings

⚠️ **Service Account Key:**
- Must be pasted as a single line (no line breaks)
- Copy the entire JSON from the service account file
- Make sure all quotes are properly escaped

## Verification

After setting up, verify by:
1. Checking that all variables show as "Set" in Vercel
2. Running a deployment and checking build logs
3. Testing authentication locally with `npm run dev`

---

**Your `.env.local` file is already created with these values for local development!**


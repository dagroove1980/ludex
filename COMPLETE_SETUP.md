# 🎲 Ludex - Complete Setup Guide

## ✅ What's Already Done

- [x] GitHub repository created: https://github.com/dagroove1980/ludex
- [x] Vercel project created
- [x] Google Sheets columns set up (`games` and `conversations`)
- [x] Project structure initialized
- [x] Environment variables configured in Vercel

## 🚀 Next Steps

### Step 1: Push to GitHub (Manual)

The git push needs to be done manually due to SSL certificate configuration:

```bash
cd /Users/david.scebat/Documents/ludex
git push -u origin main
```

If you get SSL errors, you can configure git:
```bash
git config --global http.sslVerify false
# Or use SSH instead: git remote set-url origin git@github.com:dagroove1980/ludex.git
```

### Step 2: Install Dependencies

```bash
cd /Users/david.scebat/Documents/ludex
npm install
```

This will install:
- Next.js 14
- React 18
- NextAuth.js
- Google APIs
- PDF parsing
- Gemini AI
- And all other dependencies

### Step 3: Set Up Next.js Configuration

Create `next.config.js`:

```javascript
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};
```

### Step 4: Set Up Tailwind CSS (Optional but Recommended)

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Step 5: Verify Environment Variables in Vercel

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Make sure these are set:
- ✅ `GOOGLE_SHEETS_ID` = `1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA`
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY` = (your JSON - see `.env.local` for reference)
- ✅ `GOOGLE_CLIENT_ID` = (your OAuth client ID)
- ✅ `GOOGLE_CLIENT_SECRET` = (your OAuth client secret)
- ✅ `NEXTAUTH_SECRET` = `5I2t8f2qktF0FEDRfZaS438GhBaAVjiPnjkMhLOnKbk=`
- ⚠️ `NEXTAUTH_URL` = (your Vercel URL after first deploy - update this!)
- ✅ `GEMINI_API_KEY` = `AIzaSyBnxqFbVePFCcuoFF0WjZNBn8lRpNWo8LA`
- ⚠️ `BLOB_READ_WRITE_TOKEN` = (optional, from Vercel Storage)

### Step 6: Create Missing Credentials

#### Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Application type: Web application
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google` (after deploy)

#### Gemini API Key:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create new API key
3. Copy and add to Vercel environment variables

#### NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Step 7: Start Development

```bash
npm run dev
```

Visit http://localhost:3000

### Step 8: Deploy to Vercel

After pushing to GitHub, Vercel will auto-deploy. Or deploy manually:

```bash
vercel --prod
```

## 📁 Project Structure to Create

You'll need to create these files/folders:

```
ludex/
├── app/
│   ├── layout.jsx              # Root layout
│   ├── page.jsx                 # Main library page
│   ├── game/
│   │   └── [id]/
│   │       └── page.jsx         # Game detail page
│   └── api/
│       ├── upload/route.js       # PDF upload
│       ├── process/route.js     # PDF processing
│       ├── image/route.js       # Image generation
│       └── chat/route.js         # AI chat
├── lib/
│   ├── sheets.js                # Google Sheets wrapper
│   ├── auth.js                  # NextAuth config
│   ├── storage.js               # Vercel Blob wrapper
│   ├── pdfProcessor.js          # PDF extraction
│   ├── aiProcessor.js           # Gemini AI
│   └── imageCrawler.js          # Image search
├── components/                  # React components
│   ├── GameCard.jsx
│   ├── GameDetail.jsx
│   ├── ChatInterface.jsx
│   └── UploadForm.jsx
└── public/                      # Static assets
```

## 📚 Implementation Reference

See `PROJECT_BRIEF_VERCEL.md` in the Gaming companion folder for:
- Complete API route implementations
- Frontend component code
- Google Sheets integration examples
- AI processing logic
- Authentication setup

## 🎯 Quick Start Checklist

- [ ] Push code to GitHub: `git push -u origin main`
- [ ] Install dependencies: `npm install`
- [ ] Create `next.config.js`
- [ ] Set up Tailwind CSS (optional)
- [ ] Create Google OAuth credentials
- [ ] Get Gemini API key
- [ ] Generate NEXTAUTH_SECRET
- [ ] Add all environment variables to Vercel
- [ ] Start dev server: `npm run dev`
- [ ] Begin building components (see PROJECT_BRIEF_VERCEL.md)

## 🆘 Troubleshooting

### Git Push Issues
- Use SSH instead of HTTPS: `git remote set-url origin git@github.com:dagroove1980/ludex.git`
- Or configure SSL: `git config --global http.sslVerify false`

### Environment Variables Not Working
- Make sure they're set in Vercel Dashboard
- Redeploy after adding new variables
- Check variable names match exactly

### Build Errors
- Run `npm install` first
- Check Node.js version (should be 18+)
- Verify all dependencies are installed

---

**Ready to build?** Start with the authentication setup, then build the upload form, then the game library! 🎲


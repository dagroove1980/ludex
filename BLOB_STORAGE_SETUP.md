# 🔧 Setup Vercel Blob Storage

## Problem
Upload fails because Vercel Blob Storage isn't configured.

## Solution: Enable Vercel Blob Storage

### Step 1: Create Blob Store in Vercel

1. Go to: **Vercel Dashboard → Your Project → Storage**
2. Click **"Create Database"** or **"Add Storage"**
3. Select **"Blob"** (Vercel Blob Storage)
4. Give it a name (e.g., "ludex-storage")
5. Click **"Create"**

### Step 2: Get the Token

After creating the Blob store:
1. Vercel will automatically add `BLOB_READ_WRITE_TOKEN` to your environment variables
2. Or you can find it in: **Settings → Environment Variables**
3. It should be automatically set for all environments

### Step 3: Verify

Check that `BLOB_READ_WRITE_TOKEN` exists:
```bash
vercel env ls | grep BLOB
```

### Step 4: Redeploy

After creating the Blob store:
1. Vercel will auto-redeploy
2. Or manually trigger a redeploy
3. Try uploading again

## Alternative: Use Google Drive (if you prefer)

If you don't want to use Vercel Blob, you can modify `lib/storage.js` to use Google Drive API instead. But Vercel Blob is simpler and recommended.

## After Setup

Once `BLOB_READ_WRITE_TOKEN` is set, uploads should work! The error is happening because the Blob storage isn't configured yet.


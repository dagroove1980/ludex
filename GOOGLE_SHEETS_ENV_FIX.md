# 🔧 Fix Google Sheets Environment Variables Warning

## Warning
```
WARNING: Google Sheets environment variables not found!
```

## Required Variables

You need these two environment variables set in Vercel:

1. **GOOGLE_SHEETS_ID**
   - Value: `1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA`

2. **GOOGLE_SERVICE_ACCOUNT_KEY**
   - Value: Full JSON from your service account file
   - Must be on a single line (no line breaks)

## Fix Steps

### Option 1: Add via Vercel Dashboard

1. Go to: **Vercel Dashboard → Settings → Environment Variables**
2. Click **"Add New"**

#### Add GOOGLE_SHEETS_ID:
- **Name**: `GOOGLE_SHEETS_ID`
- **Value**: `1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Add GOOGLE_SERVICE_ACCOUNT_KEY:
1. Open your service account JSON file: `ludex-482617-85c4fd00adfb.json`
2. Copy the **entire JSON** (all on one line, no line breaks)
3. In Vercel, click **"Add New"** again
4. **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
5. **Value**: Paste the entire JSON (should start with `{"type":"service_account",...}`)
6. **Important**: Make sure it's all on one line (no `\n` or actual line breaks)
7. **Environments**: ✅ Production, ✅ Preview, ✅ Development
8. Click **Save**

### Option 2: Add via CLI

```bash
cd /Users/david.scebat/Documents/ludex

# Add GOOGLE_SHEETS_ID
echo "1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA" | vercel env add GOOGLE_SHEETS_ID production
echo "1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA" | vercel env add GOOGLE_SHEETS_ID preview
echo "1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA" | vercel env add GOOGLE_SHEETS_ID development

# Add GOOGLE_SERVICE_ACCOUNT_KEY (replace with your actual JSON)
cat ludex-482617-85c4fd00adfb.json | tr -d '\n' | vercel env add GOOGLE_SERVICE_ACCOUNT_KEY production
cat ludex-482617-85c4fd00adfb.json | tr -d '\n' | vercel env add GOOGLE_SERVICE_ACCOUNT_KEY preview
cat ludex-482617-85c4fd00adfb.json | tr -d '\n' | vercel env add GOOGLE_SERVICE_ACCOUNT_KEY development
```

## Verify

After adding, check they're set:
```bash
vercel env ls | grep GOOGLE_SHEETS
```

## After Adding

1. Vercel will auto-redeploy
2. The warning should disappear
3. Google Sheets integration will work

## Note

The warning appears during build but doesn't break the app. However, you need these variables for:
- Creating game records
- Storing conversation history
- All Google Sheets operations

Make sure to add both variables!


# 📊 Setup Google Sheets Columns for Ludex

This script automatically creates the column headers for your Google Sheets.

## Prerequisites

1. **Google Sheet created** - Create a new spreadsheet at https://sheets.google.com
2. **Service Account** - Have your service account JSON credentials ready
3. **Node.js** - Make sure Node.js is installed
4. **googleapis package** - Install if not already installed

## Installation

First, install the required package:

```bash
cd "/Users/david.scebat/Documents/Geek Automation/products/websites/Gaming companion"
npm install googleapis
```

## Usage

### Option 1: Interactive Mode (Recommended)

Run the script and it will prompt you for the required information:

```bash
node setup-sheets-columns.js
```

You'll be asked for:
- Google Sheet ID (from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`)
- Service Account JSON (paste the full JSON content or provide file path)

### Option 2: Environment Variables

Set environment variables and run:

```bash
export GOOGLE_SHEETS_ID="your_sheet_id_here"
export GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
node setup-sheets-columns.js
```

### Option 3: With JSON File Path

If your service account JSON is in a file:

```bash
export GOOGLE_SHEETS_ID="your_sheet_id_here"
node setup-sheets-columns.js
# When prompted, enter the path to your JSON file
```

## What It Does

The script will:

1. ✅ Authenticate with Google Sheets API using your service account
2. ✅ Create two sheets: `games` and `conversations` (if they don't exist)
3. ✅ Add column headers to each sheet:
   - **games**: gameId, title, userId, pdfUrl, pdfFileName, createdAt, updatedAt, status, ogImageUrl, sections, strategyTips, quickStart, errorMessage
   - **conversations**: conversationId, gameId, userId, messages, createdAt, updatedAt
4. ✅ Format header rows (blue background, white bold text)
5. ✅ Freeze header rows
6. ✅ Auto-resize columns

## Column Structure

### Sheet: `games`

| Column | Type | Description |
|--------|------|-------------|
| gameId | string | Unique game ID (UUID) |
| title | string | Game name (from filename) |
| userId | string | Owner's email or Google ID |
| pdfUrl | string | URL to PDF in storage |
| pdfFileName | string | Original filename |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |
| status | string | 'processing', 'completed', or 'error' |
| ogImageUrl | string | Game image URL (nullable) |
| sections | string | JSON string of sections array |
| strategyTips | string | JSON string of tips array |
| quickStart | string | JSON string of quickStart object |
| errorMessage | string | Error message if status is 'error' |

### Sheet: `conversations`

| Column | Type | Description |
|--------|------|-------------|
| conversationId | string | Unique conversation ID (UUID) |
| gameId | string | Associated game ID |
| userId | string | Owner's email or Google ID |
| messages | string | JSON string of messages array |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

## Troubleshooting

### Error: "googleapis package not found"
```bash
npm install googleapis
```

### Error: "Invalid service account JSON"
- Make sure you're pasting the complete JSON content
- Check that the JSON is valid (no missing quotes, brackets, etc.)
- If using a file path, ensure the file exists and is readable

### Error: "The caller does not have permission"
This means your service account doesn't have access to the Google Sheet.

**Step-by-Step Fix:**

1. **Find your service account email:**
   - Open your service account JSON file: `ludex-482617-85c4fd00adfb.json`
   - Look for the `client_email` field (e.g., `ludex-482617@your-project.iam.gserviceaccount.com`)
   - Or check in Google Cloud Console → IAM & Admin → Service Accounts

2. **Share the Google Sheet:**
   - Open your Google Sheet: https://docs.google.com/spreadsheets/d/1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA/edit
   - Click the **"Share"** button (top right)
   - Paste your service account email (the `client_email` from step 1)
   - Set permission to **"Editor"** (not Viewer!)
   - Click **"Send"** (you can uncheck "Notify people" if you want)

3. **Verify the share:**
   - The service account email should appear in the sharing list
   - Make sure it shows "Editor" access

4. **Run the script again:**
   ```bash
   node setup-sheets-columns.js
   ```

**Quick Check:**
You can also verify by checking the service account email in your JSON file:
```bash
cat "ludex-482617-85c4fd00adfb.json" | grep client_email
```
Then share the sheet with that email address.

### Error: "Unable to parse range"
- Ensure the Sheet ID is correct (from the URL)
- Check that the spreadsheet exists and is accessible

### Error: "Google Sheets API has not been used in project... or it is disabled"
This means the Google Sheets API is not enabled for your Google Cloud project.

**Quick Fix:**
1. Click the activation URL provided in the error message, or
2. Go to: https://console.cloud.google.com/apis/library/sheets.googleapis.com
3. Select your project (or create a new one)
4. Click "Enable"
5. Wait 1-2 minutes for the API to propagate
6. Run the script again

**For your specific project (247399756758):**
- Direct link: https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=247399756758
- Click "Enable" and wait a few minutes before retrying

## Verification

After running the script, verify:

1. Open your Google Sheet: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
2. Check that both `games` and `conversations` sheets exist
3. Verify column headers are in row 1
4. Check that header row is formatted (blue background, bold white text)
5. Confirm header row is frozen

## Next Steps

After setting up the columns:

1. ✅ Your Google Sheets are ready to use
2. ✅ Set up environment variables in your Vercel project
3. ✅ Start building your application
4. ✅ The sheets will be populated automatically as users upload games

## Example Output

```
🎲 Ludex - Google Sheets Column Setup
=====================================

✓ Found GOOGLE_SHEETS_ID in environment
✓ Found GOOGLE_SERVICE_ACCOUNT_KEY in environment

🔐 Authenticating with Google Sheets API...
📊 Setting up sheet structure...

📄 Spreadsheet: ludex
📋 Existing sheets: Sheet1

📝 Setting up 'games' sheet...
   ➕ Creating sheet 'games'...
   ✅ Created sheet 'games'
   📋 Setting column headers...
   🎨 Formatting header row...
   📏 Auto-resizing columns...
   ✅ Sheet 'games' setup complete!

📝 Setting up 'conversations' sheet...
   ➕ Creating sheet 'conversations'...
   ✅ Created sheet 'conversations'
   📋 Setting column headers...
   🎨 Formatting header row...
   📏 Auto-resizing columns...
   ✅ Sheet 'conversations' setup complete!

🎉 All sheets configured successfully!

📊 View your sheet: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit

✅ Setup complete! Your Google Sheets are ready to use.
```


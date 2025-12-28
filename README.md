# ludex

AI-powered board game rulebook companion - Turn PDFs into Play

## Setup

This project is automatically configured with:
- ✅ GitHub repository
- ✅ Google Sheets database
- ✅ Vercel deployment

## Development

```bash
npm install
npm run dev
```

## Deployment

Deployment is automatic via Vercel when you push to main branch.

## Environment Variables

Set in Vercel dashboard:
- `GOOGLE_SHEETS_ID` - Your Google Sheet ID
- `GOOGLE_SERVICE_ACCOUNT_KEY` - Your service account JSON (as string)

## Database Setup

1. Check `google-sheets-schema.md` for sheet structure
2. Your Google Sheet should be set up with the proper columns
3. Share sheet with service account email (Editor access)

# Force fresh deployment - Sun Dec 28 20:38:56 IST 2025


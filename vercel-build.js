// Vercel build script to inject environment variables
const fs = require('fs');
const path = require('path');

// Only run this in Vercel (where VERCEL env var is set)
if (!process.env.VERCEL) {
    console.log('Build script: Skipping (not in Vercel environment)');
    process.exit(0);
}

// Get environment variables and clean them thoroughly
let rawSheetId = process.env.GOOGLE_SHEETS_ID || '';
let rawServiceKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';

console.log('Build script running in Vercel...');
console.log('GOOGLE_SHEETS_ID:', rawSheetId ? `${rawSheetId.substring(0, 20)}...` : 'NOT SET');
console.log('GOOGLE_SERVICE_ACCOUNT_KEY:', rawServiceKey ? 'SET' : 'NOT SET');

// Clean the values: remove all newlines (both literal and escaped), trim whitespace
let sheetId = rawSheetId.replace(/\\n/g, '').replace(/\n/g, '').replace(/\r/g, '').trim();
let serviceKey = rawServiceKey.replace(/\\n/g, '').replace(/\n/g, '').replace(/\r/g, '').trim();

if (!sheetId || !serviceKey) {
    console.warn('WARNING: Google Sheets environment variables not found!');
    console.warn('Make sure GOOGLE_SHEETS_ID and GOOGLE_SERVICE_ACCOUNT_KEY are set in Vercel.');
    // Don't exit - let Next.js build continue
} else {
    // Create a config.js file with the Google Sheets credentials (if needed)
    const configContent = `// Auto-generated config file - created during build
window.GOOGLE_SHEETS_ID = ${JSON.stringify(sheetId)};
window.GOOGLE_SERVICE_ACCOUNT_KEY = ${JSON.stringify(serviceKey)};
`;

    const configPath = path.join(__dirname, 'public', 'config.js');
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log('✓ Created config.js with Google Sheets credentials');
}

console.log('Build script completed.');

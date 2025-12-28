#!/usr/bin/env node
/**
 * Setup Google Sheets Columns for Ludex
 * 
 * This script creates the column headers for the 'games' and 'conversations' sheets
 * 
 * Usage:
 *   node setup-sheets-columns.js
 * 
 * Or with environment variables:
 *   GOOGLE_SHEETS_ID=your_sheet_id GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}' node setup-sheets-columns.js
 */

const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Column definitions for Ludex
const SHEETS_CONFIG = {
  games: {
    name: 'games',
    headers: [
      'gameId',
      'title',
      'userId',
      'pdfUrl',
      'pdfFileName',
      'createdAt',
      'updatedAt',
      'status',
      'ogImageUrl',
      'sections',
      'strategyTips',
      'quickStart',
      'errorMessage'
    ]
  },
  conversations: {
    name: 'conversations',
    headers: [
      'conversationId',
      'gameId',
      'userId',
      'messages',
      'createdAt',
      'updatedAt'
    ]
  }
};

async function setupSheetsColumns(sheetId, serviceAccountKey) {
  try {
    console.log('🔐 Authenticating with Google Sheets API...');
    
    // Parse service account key
    let credentials;
    try {
      credentials = typeof serviceAccountKey === 'string' 
        ? JSON.parse(serviceAccountKey) 
        : serviceAccountKey;
    } catch (e) {
      throw new Error('Invalid service account JSON. Please check your credentials.');
    }

    // Authenticate
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('📊 Setting up sheet structure...\n');

    // Get spreadsheet info
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    console.log(`📄 Spreadsheet: ${spreadsheet.data.properties.title}`);
    console.log(`📋 Existing sheets: ${spreadsheet.data.sheets.map(s => s.properties.title).join(', ')}\n`);

    // Setup each sheet
    for (const [key, config] of Object.entries(SHEETS_CONFIG)) {
      console.log(`📝 Setting up '${config.name}' sheet...`);

      // Check if sheet exists
      const existingSheet = spreadsheet.data.sheets.find(
        s => s.properties.title === config.name
      );

      let sheetId_local;
      if (existingSheet) {
        console.log(`   ✓ Sheet '${config.name}' already exists`);
        sheetId_local = existingSheet.properties.sheetId;
        
        // Clear existing data (optional - comment out if you want to keep existing data)
        // await sheets.spreadsheets.values.clear({
        //   spreadsheetId: sheetId,
        //   range: `${config.name}!A1:Z1000`,
        // });
      } else {
        // Create new sheet
        console.log(`   ➕ Creating sheet '${config.name}'...`);
        const addSheetResponse = await sheets.spreadsheets.batchUpdate({
          spreadsheetId: sheetId,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: config.name,
                }
              }
            }]
          }
        });
        sheetId_local = addSheetResponse.data.replies[0].addSheet.properties.sheetId;
        console.log(`   ✅ Created sheet '${config.name}'`);
      }

      // Set headers
      console.log(`   📋 Setting column headers...`);
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${config.name}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [config.headers]
        }
      });

      // Format header row
      console.log(`   🎨 Formatting header row...`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheetId_local,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.2,
                      green: 0.4,
                      blue: 0.8,
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 1.0,
                        green: 1.0,
                        blue: 1.0,
                      },
                      bold: true,
                      fontSize: 11,
                    },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
            {
              updateSheetProperties: {
                properties: {
                  sheetId: sheetId_local,
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
                fields: 'gridProperties.frozenRowCount',
              },
            },
          ],
        },
      });

      // Auto-resize columns
      console.log(`   📏 Auto-resizing columns...`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: sheetId_local,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: config.headers.length,
                },
              },
            },
          ],
        },
      });

      console.log(`   ✅ Sheet '${config.name}' setup complete!\n`);
    }

    console.log('🎉 All sheets configured successfully!');
    console.log(`\n📊 View your sheet: https://docs.google.com/spreadsheets/d/${sheetId}/edit`);
    
    return true;
  } catch (error) {
    console.error('❌ Error setting up sheets:', error.message);
    if (error.response) {
      console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

async function main() {
  console.log('🎲 Ludex - Google Sheets Column Setup');
  console.log('=====================================\n');

  // Get credentials from environment or prompt
  let sheetId = process.env.GOOGLE_SHEETS_ID;
  let serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!sheetId) {
    sheetId = await question('Enter your Google Sheet ID: ');
  } else {
    console.log(`✓ Found GOOGLE_SHEETS_ID in environment`);
  }

  if (!serviceAccountKey) {
    console.log('\n📋 Service Account JSON:');
    console.log('   Option 1: Paste the full JSON content');
    console.log('   Option 2: Enter path to JSON file');
    const input = await question('   Service Account JSON or file path: ');
    
    if (input.trim().startsWith('{')) {
      // It's JSON content
      serviceAccountKey = input.trim();
    } else if (fs.existsSync(input.trim())) {
      // It's a file path
      serviceAccountKey = fs.readFileSync(input.trim(), 'utf8');
    } else {
      console.error('❌ Invalid input. Please provide JSON content or valid file path.');
      process.exit(1);
    }
  } else {
    console.log(`✓ Found GOOGLE_SERVICE_ACCOUNT_KEY in environment`);
  }

  console.log('');

  // Setup sheets
  const success = await setupSheetsColumns(sheetId.trim(), serviceAccountKey);

  rl.close();

  if (success) {
    console.log('\n✅ Setup complete! Your Google Sheets are ready to use.');
    process.exit(0);
  } else {
    console.log('\n❌ Setup failed. Please check the errors above.');
    process.exit(1);
  }
}

// Check if googleapis is installed
try {
  require.resolve('googleapis');
} catch (e) {
  console.error('❌ Error: googleapis package not found.');
  console.error('   Install it with: npm install googleapis');
  process.exit(1);
}

main().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  rl.close();
  process.exit(1);
});


import { google } from 'googleapis';
import crypto from 'crypto';

// Initialize Google Sheets client
let auth, sheets;

function getSheetsClient() {
  if (!auth) {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }
    if (!process.env.GOOGLE_SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID environment variable is not set');
    }
    
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      throw new Error(`Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY: ${error.message}`);
    }
    
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    sheets = google.sheets({ version: 'v4', auth });
  }
  return sheets;
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

// Read games for user
export async function getUserGames(userId) {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEETS_ID environment variable is not set');
    }
    
    console.log('Fetching games from spreadsheet:', SPREADSHEET_ID.substring(0, 20) + '...');
    
    const sheetsClient = getSheetsClient();
    
    // First, verify the spreadsheet exists and get sheet info
    try {
      const spreadsheetInfo = await sheetsClient.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });
      
      const sheetNames = spreadsheetInfo.data.sheets?.map(s => s.properties.title) || [];
      console.log('Available sheets:', sheetNames);
      
      if (!sheetNames.includes('games')) {
        throw new Error(`Sheet "games" not found. Available sheets: ${sheetNames.join(', ')}`);
      }
    } catch (infoError) {
      if (infoError.message.includes('not found')) {
        throw new Error(`Spreadsheet not found. Check that GOOGLE_SHEETS_ID is correct: ${SPREADSHEET_ID.substring(0, 20)}...`);
      }
      throw infoError;
    }
    
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'games!A2:M', // Skip header row
    });

    const rows = response.data.values || [];
    return rows
      .filter(row => row[2] === userId) // Filter by userId (column C)
      .map(row => {
        try {
          return {
            gameId: row[0],
            title: row[1],
            userId: row[2],
            pdfUrl: row[3],
            pdfFileName: row[4],
            createdAt: row[5],
            updatedAt: row[6],
            status: row[7] || 'processing',
            ogImageUrl: row[8] || '',
            sections: row[9] ? JSON.parse(row[9]) : [],
            strategyTips: row[10] ? JSON.parse(row[10]) : [],
            quickStart: row[11] ? JSON.parse(row[11]) : {},
            errorMessage: row[12] || '',
          };
        } catch (parseError) {
          console.error('Error parsing game row:', parseError, row);
          return null;
        }
      })
      .filter(Boolean);
  } catch (error) {
    console.error('getUserGames error:', error);
    console.error('Spreadsheet ID:', SPREADSHEET_ID ? SPREADSHEET_ID.substring(0, 20) + '...' : 'NOT SET');
    throw error;
  }
}

// Get game by ID
export async function getGameById(gameId, userId) {
  const sheetsClient = getSheetsClient();
  const response = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'games!A2:M',
  });

  const rows = response.data.values || [];
  const row = rows.find(r => r[0] === gameId);
  
  if (!row) return null;
  if (row[2] !== userId) throw new Error('Unauthorized');

  return {
    gameId: row[0],
    title: row[1],
    userId: row[2],
    pdfUrl: row[3],
    pdfFileName: row[4],
    createdAt: row[5],
    updatedAt: row[6],
    status: row[7] || 'processing',
    ogImageUrl: row[8] || '',
    sections: row[9] ? JSON.parse(row[9]) : [],
    strategyTips: row[10] ? JSON.parse(row[10]) : [],
    quickStart: row[11] ? JSON.parse(row[11]) : {},
    errorMessage: row[12] || '',
  };
}

// Create game
export async function createGame(gameData) {
  const sheetsClient = getSheetsClient();
  const gameId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await sheetsClient.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'games!A:M',
    valueInputOption: 'RAW',
    resource: {
      values: [[
        gameId,
        gameData.title,
        gameData.userId,
        gameData.pdfUrl,
        gameData.pdfFileName,
        now,
        now,
        'processing',
        '',
        '[]',
        '[]',
        '{}',
        '',
      ]],
    },
  });

  return gameId;
}

// Update game
export async function updateGame(gameId, userId, updates) {
  const sheetsClient = getSheetsClient();
  
  // Find row by gameId
  const response = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'games!A2:M',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === gameId);
  
  if (rowIndex === -1) throw new Error('Game not found');
  if (rows[rowIndex][2] !== userId) throw new Error('Unauthorized');

  const actualRowIndex = rowIndex + 2; // +2 because we skip header and 0-indexed
  
  // Build update requests
  const updateRequests = [];
  const columns = {
    title: 'B',
    pdfUrl: 'D',
    pdfFileName: 'E',
    updatedAt: 'G',
    status: 'H',
    ogImageUrl: 'I',
    sections: 'J',
    strategyTips: 'K',
    quickStart: 'L',
    errorMessage: 'M',
  };

  for (const [key, value] of Object.entries(updates)) {
    if (columns[key]) {
      let cellValue = value;
      if (key === 'sections' || key === 'strategyTips' || key === 'quickStart') {
        cellValue = JSON.stringify(value);
      }
      if (key === 'updatedAt' && !cellValue) {
        cellValue = new Date().toISOString();
      }
      
      updateRequests.push({
        range: `games!${columns[key]}${actualRowIndex}`,
        values: [[cellValue]],
      });
    }
  }

  if (updateRequests.length > 0) {
    await sheetsClient.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: updateRequests,
      },
    });
  }
}

// Conversation functions
export async function getConversation(gameId, userId) {
  const sheetsClient = getSheetsClient();
  const response = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'conversations!A2:F',
  });

  const rows = response.data.values || [];
  const row = rows.find(r => r[1] === gameId && r[2] === userId);
  
  if (!row) return null;

  return {
    conversationId: row[0],
    gameId: row[1],
    userId: row[2],
    messages: row[3] ? JSON.parse(row[3]) : [],
    createdAt: row[4],
    updatedAt: row[5],
  };
}

export async function createOrUpdateConversation(gameId, userId, messages) {
  const sheetsClient = getSheetsClient();
  const response = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'conversations!A2:F',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(r => r[1] === gameId && r[2] === userId);
  
  const now = new Date().toISOString();
  const conversationId = rowIndex === -1 ? crypto.randomUUID() : rows[rowIndex][0];

  if (rowIndex === -1) {
    // Create new
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'conversations!A:F',
      valueInputOption: 'RAW',
      resource: {
        values: [[
          conversationId,
          gameId,
          userId,
          JSON.stringify(messages),
          now,
          now,
        ]],
      },
    });
  } else {
    // Update existing
    const actualRowIndex = rowIndex + 2;
    await sheetsClient.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: [
          {
            range: `conversations!D${actualRowIndex}`,
            values: [[JSON.stringify(messages)]],
          },
          {
            range: `conversations!F${actualRowIndex}`,
            values: [[now]],
          },
        ],
      },
    });
  }

  return conversationId;
}


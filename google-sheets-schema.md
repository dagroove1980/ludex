# Google Sheets Schema for ludex

## Sheet Structure

### Main Sheet (Sheet1)

Create the following columns in the first row:

| Column | Type | Description |
|--------|------|-------------|
| id | Text | Unique identifier (UUID) |
| name | Text | Item name |
| description | Text | Item description |
| createdAt | Text | ISO timestamp |
| updatedAt | Text | ISO timestamp |

## Setup Instructions

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1_eP6VUevK_03cXHYAWuwBlUBqAgO4THPANHoNVXrypA/edit
2. Add the column headers in row 1 (as shown above)
3. Format the sheet as needed
4. Share with service account email (Editor access)

## Service Account Setup

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a project or select existing
3. Enable Google Sheets API: https://console.cloud.google.com/apis/library/sheets.googleapis.com
4. Enable Google Drive API: https://console.cloud.google.com/apis/library/drive.googleapis.com
5. Create Service Account: https://console.cloud.google.com/iam-admin/serviceaccounts
6. Download JSON credentials
7. Share Google Sheet with service account email (Editor access)

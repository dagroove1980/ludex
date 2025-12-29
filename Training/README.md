# Fantasy Flight Games Rules Downloader

This script downloads all rulebook PDFs from Fantasy Flight Games product pages using browser automation.

## Installation

First, install the required dependency:

```bash
cd ludex
npm install
```

This will install `puppeteer` which is needed for browser automation.

## Usage

```bash
cd Training
node download_rules.js
```

## What it does

1. **Launches a browser** - Uses Puppeteer to open a headless Chrome browser
2. **Fetches the products page** - Navigates to the Fantasy Flight Games products page
3. **Finds all product links** - Extracts links to individual product pages (e.g., `/en/products/descent-legends-of-the-dark/`)
4. **Visits each product page** - Opens each product page and waits for content to load
5. **Finds Rules section** - Locates PDF links in the Rules section (elements with class `support-item`)
6. **Downloads PDFs** - Downloads all PDF files from the Rules section
7. **Organizes files** - Saves PDFs in subfolders organized by product name

## Output Structure

```
Training/
  rules_pdfs/
    descent-legends-of-the-dark/
      Descent_Legends_of_the_Dark_Learn_to_Play.pdf
      The_Betrayer_s_War_Rulebook.pdf
    ...
```

## Features

- **Browser automation** - Uses Puppeteer to handle JavaScript-rendered content and avoid 403 errors
- **Respectful scraping** - Includes delays between requests to avoid overwhelming the server
- **Duplicate prevention** - Skips files that already exist
- **Error handling** - Continues processing even if individual downloads fail
- **Organized storage** - Creates separate folders for each product
- **Sanitized filenames** - Removes invalid characters from filenames

## Requirements

- Node.js (v14 or higher)
- npm
- Puppeteer (installed via `npm install`)

## Notes

- The script uses headless Chrome (no visible browser window)
- The script may take a while to complete depending on the number of products
- Some products may not have Rules sections, which is normal
- If the website structure changes, the script may need updates
- First run will download Chromium (~170MB) which Puppeteer uses


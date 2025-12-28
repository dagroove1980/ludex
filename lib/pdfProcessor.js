import pdf from 'pdf-parse';

export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    // Limit to first 15,000 characters for AI processing
    return data.text.substring(0, 15000);
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

export function extractTitleFromFilename(filename) {
  // Remove .pdf extension and clean up
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}


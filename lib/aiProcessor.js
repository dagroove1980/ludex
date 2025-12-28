import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function processGameRules(gameTitle, pdfText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `You are analyzing a board game rulebook. Extract and organize the following information from the rulebook text.

Game Title: ${gameTitle}

Rulebook Text:
${pdfText}

Please extract and return a JSON object with the following structure:
{
  "sections": [
    {"title": "Section Title", "content": "Full content of this section", "order": 1},
    {"title": "Section Title", "content": "Full content of this section", "order": 2}
  ],
  "strategyTips": [
    {"tip": "Strategy tip text", "category": "Category name"},
    {"tip": "Strategy tip text", "category": "Category name"}
  ],
  "quickStart": {
    "setup": "Brief setup instructions",
    "firstTurn": "What happens on the first turn",
    "keyRules": ["Important rule 1", "Important rule 2", "Important rule 3"]
  }
}

Requirements:
- Extract 3-7 main sections (like Setup, Gameplay, Scoring, etc.)
- Extract 3-5 strategy tips with relevant categories
- Create a concise quick-start guide
- Return ONLY valid JSON, no markdown formatting or code blocks`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error('AI processing error:', error);
    throw new Error(`Failed to process game rules: ${error.message}`);
  }
}

export async function chatAboutGame(gameTitle, sections, strategyTips, quickStart, conversationHistory, userMessage) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  // Prepare context
  const sectionsText = sections.map(s => `${s.title}: ${s.content.substring(0, 200)}...`).join('\n\n');
  const tipsText = strategyTips.map(t => `- ${t.tip} (${t.category})`).join('\n');
  const quickStartText = `Setup: ${quickStart.setup}\nFirst Turn: ${quickStart.firstTurn}\nKey Rules: ${quickStart.keyRules.join(', ')}`;
  
  const historyText = conversationHistory
    .slice(-10) // Last 10 messages
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  const prompt = `You are a helpful assistant answering questions about the board game "${gameTitle}".

Game Information:
${sectionsText}

Strategy Tips:
${tipsText}

Quick Start:
${quickStartText}

Previous Conversation:
${historyText || 'None'}

User Question: ${userMessage}

Please provide a clear, helpful answer based on the game rules above. Be concise but thorough. If the question can't be answered from the provided information, say so politely.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
}


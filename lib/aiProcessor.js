import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set!');
}

// Initialize OpenAI client with proper configuration
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY.trim(), // Remove any whitespace
      maxRetries: 2, // Reduce retries to avoid timeout
      timeout: 30000, // 30 seconds (Vercel Hobby has 10s limit anyway)
    });
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
  }
}

export async function processGameRules(gameTitle, pdfText) {
  if (!openai) {
    throw new Error('OPENAI_API_KEY environment variable is not set. Please add it in Vercel Settings → Environment Variables.');
  }

  // Limit PDF text to avoid timeout (Vercel Hobby has 10s limit)
  const limitedText = pdfText.substring(0, 5000); // First 5000 chars only
  
  const prompt = `Analyze this board game rulebook and return JSON only:

Game: ${gameTitle}
Rules: ${limitedText}

Return JSON:
{"sections":[{"title":"Title","content":"Content","order":1}],"strategyTips":[{"tip":"Tip","category":"Category"}],"quickStart":{"setup":"Setup","firstTurn":"First turn","keyRules":["Rule1","Rule2"]}}`;

  try {
    console.log('Calling OpenAI API...');
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');
    
    // Try with retry logic
    let completion;
    let lastError;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`OpenAI API attempt ${attempt}/${maxRetries}`);
        // Simplified, faster request
        completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 1500, // Smaller response = faster
        }, {
          timeout: 20000, // 20 second timeout
        });
        console.log(`OpenAI API attempt ${attempt} succeeded`);
        break; // Success, exit retry loop
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = 1000 * attempt;
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    if (!completion) {
      throw lastError || new Error('All retry attempts failed');
    }
    
    const text = completion.choices[0].message.content;
    console.log('AI response received, length:', text.length);
    
    // Clean up the response - remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(cleanedText);
    console.log('Successfully parsed JSON response');
    return parsed;
  } catch (error) {
    console.error('AI processing error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      type: error.type,
      code: error.code,
      status: error.status,
      stack: error.stack
    });
    
    // More specific error messages
    if (error.message.includes('Connection') || error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      throw new Error(`OpenAI API connection failed. This might be a network issue or API key problem. Check your OPENAI_API_KEY in Vercel. Error: ${error.message}`);
    }
    
    if (error.status === 401 || error.message.includes('Invalid API key')) {
      throw new Error(`Invalid OpenAI API key. Please check your OPENAI_API_KEY in Vercel Settings → Environment Variables.`);
    }
    
    throw new Error(`Failed to process game rules: ${error.message}`);
  }
}

export async function chatAboutGame(gameTitle, sections, strategyTips, quickStart, conversationHistory, userMessage) {
  if (!openai) {
    throw new Error('OPENAI_API_KEY environment variable is not set.');
  }

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
    // Convert conversation history to OpenAI format
    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant answering questions about the board game "${gameTitle}".`
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
}


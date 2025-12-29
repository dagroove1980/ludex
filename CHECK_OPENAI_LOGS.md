# 🔍 Check OpenAI Connection Error

## Current Error
```
OpenAI API connection failed. This might be a network issue or API key problem.
Error: Connection error.
```

## Steps to Debug

### 1. Check Vercel Logs

Go to: **Vercel Dashboard → Deployments → Latest → Functions → `/api/process` → Logs**

Look for:
- "API Key present: true/false"
- "API Key prefix: sk-proj-..."
- "OpenAI API attempt 1/3"
- Any detailed error messages

### 2. Verify API Key

1. Go to: **Vercel Dashboard → Settings → Environment Variables**
2. Check `OPENAI_API_KEY` for **Production**
3. Make sure it's the full key (starts with `sk-proj-...`)
4. No spaces or newlines

### 3. Test API Key Directly

You can test if the API key works by running this in a Node.js environment:

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: 'YOUR_KEY_HERE' });

openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Hello' }]
})
.then(console.log)
.catch(console.error);
```

### 4. Check Network/Timeout

The connection error might be:
- Vercel function timeout (10s on Hobby plan)
- OpenAI API being slow
- Network issues between Vercel and OpenAI

**Solution:** The code now has:
- Retry logic (3 attempts)
- 60 second timeout
- Better error logging

### 5. Alternative: Use Different Model

If `gpt-3.5-turbo` doesn't work, we can try:
- `gpt-4-turbo-preview`
- `gpt-4`
- Or check what models your API key has access to

## After Checking Logs

Share the log output and we can identify the exact issue. The improved logging should show:
- Whether the API key is being read
- What error OpenAI is returning
- Whether it's a timeout or connection issue


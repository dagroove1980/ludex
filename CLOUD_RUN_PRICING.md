# Cloud Run Pricing for Ludex PDF Processor

## Free Tier (Always Free)

Google Cloud Run has a generous free tier:

- **2 million requests per month** - FREE
- **400,000 GB-seconds of memory** - FREE
- **200,000 vCPU-seconds** - FREE
- **1 GB egress per month** - FREE

## Your Service Configuration

Based on your deployment settings:
- **Memory**: 2 GiB per instance
- **Timeout**: 300 seconds (5 minutes)
- **Min instances**: 0 (scales to zero when not in use)
- **Max instances**: 10

## Cost Breakdown

### If You Stay Within Free Tier

**Cost: $0/month** if you:
- Process less than ~1,000 PDFs per month (assuming 5 min processing time each)
- Stay under 2 million requests

### If You Exceed Free Tier

**Pricing:**
- **CPU**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million requests (after free tier)

### Example Monthly Costs

**Light Usage** (100 PDFs/month):
- Processing time: ~500 minutes = 30,000 seconds
- Memory: 2 GiB × 30,000 seconds = 60,000 GiB-seconds
- **Cost: $0** (well within free tier)

**Medium Usage** (1,000 PDFs/month):
- Processing time: ~5,000 minutes = 300,000 seconds
- Memory: 2 GiB × 300,000 seconds = 600,000 GiB-seconds
- **Cost: ~$1.50/month** (exceeds free tier memory)

**Heavy Usage** (10,000 PDFs/month):
- Processing time: ~50,000 minutes = 3,000,000 seconds
- Memory: 2 GiB × 3,000,000 seconds = 6,000,000 GiB-seconds
- **Cost: ~$15/month**

## Cost Optimization Tips

1. **Scale to Zero**: Your service scales to zero when idle (min-instances: 0), so you only pay when processing
2. **Reduce Memory**: If PDFs are small, you could reduce to 1 GiB (saves 50%)
3. **Optimize Processing**: Faster processing = less time = lower cost
4. **Monitor Usage**: Set up billing alerts in Google Cloud Console

## Set Up Billing Alerts

1. Go to: https://console.cloud.google.com/billing
2. Select your billing account
3. Go to "Budgets & alerts"
4. Create a budget (e.g., $10/month)
5. Set alerts at 50%, 90%, 100%

## Estimated Monthly Cost

For typical usage (100-500 PDFs/month):
- **$0-2/month** (mostly free tier)

For heavy usage (1,000+ PDFs/month):
- **$2-20/month** depending on volume

## Comparison to Current Solution

**Current (Vercel + OpenAI)**:
- Vercel: Free tier (but 10s timeout limit)
- OpenAI API: ~$0.002 per PDF (GPT-3.5-turbo)
- **Total: ~$0.20 per PDF**

**New (Cloud Run)**:
- Cloud Run: Mostly free tier
- No API costs
- **Total: ~$0.00-0.02 per PDF** (after free tier)

**Savings: 90%+ cost reduction** for PDF processing!

## Important Notes

- **Billing account required**: Even with free tier, you need a billing account linked
- **No charges if unused**: Service scales to zero, so no cost when idle
- **First $300 credit**: New Google Cloud accounts get $300 free credit (valid for 90 days)

## Monitor Your Costs

```bash
# View current month's costs
gcloud billing accounts list
gcloud billing projects describe ludex-pdf-processor
```

Or check in the console:
https://console.cloud.google.com/billing


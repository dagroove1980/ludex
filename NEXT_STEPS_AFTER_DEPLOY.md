# Next Steps After Deployment

## ✅ Deployment Complete!

Your Python service is now live at:
**https://ludex-pdf-processor-255233430004.us-central1.run.app**

## Step 1: Test the Service

Test that it's working:

```bash
curl https://ludex-pdf-processor-255233430004.us-central1.run.app/health
```

Should return: `{"status":"healthy"}`

## Step 2: Add to Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on your **ludex** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Key**: `PYTHON_SERVICE_URL`
   - **Value**: `https://ludex-pdf-processor-255233430004.us-central1.run.app`
   - **Environment**: Check all (Production, Preview, Development)
6. Click **Save**

## Step 3: Redeploy Vercel App

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Step 4: Test End-to-End

1. Go to your deployed Ludex app
2. Sign in
3. Upload a PDF rulebook
4. Wait for processing (should be faster now!)
5. Check the **Rules** tab - you should see:
   - ✅ Left sidebar with section navigation
   - ✅ Structured rules (actual rules, not AI summaries)
   - ✅ Subsections if available

## Troubleshooting

### If processing still uses OpenAI

- Check that `PYTHON_SERVICE_URL` is set correctly in Vercel
- Make sure you redeployed after adding the variable
- Check Vercel logs to see which service is being called

### If you get errors

- Check Cloud Run logs:
  ```bash
  gcloud run services logs read ludex-pdf-processor --region us-central1 --limit 50
  ```

- Check Vercel function logs in the dashboard

### Update the service later

If you make changes to the Python code:

```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
gcloud run deploy ludex-pdf-processor --source . --region us-central1
```

## Success Indicators

✅ Service health check returns `{"status":"healthy"}`
✅ PDF processing completes in < 30 seconds (vs. timeout before)
✅ Rules tab shows structured sections with sidebar
✅ Rules are actual extracted text, not AI summaries


# Fix Permission Issues

You're getting permission denied because your account doesn't have the right permissions on the new project.

## Solution 1: Enable APIs via Web UI (Easiest)

1. Go to: https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com?project=ludex-pdf-processor
2. Click **Enable**
3. Go to: https://console.cloud.google.com/apis/library/run.googleapis.com?project=ludex-pdf-processor
4. Click **Enable**

Then continue with deployment.

## Solution 2: Grant Yourself Permissions

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=ludex-pdf-processor
2. Click **Grant Access**
3. Add your email: `david.scebat@fiverr.com`
4. Select role: **Owner** (or at minimum: **Editor** + **Service Usage Admin**)
5. Click **Save**

Then try the deployment again.

## Solution 3: Use Different Account

If you have a personal Google account, switch to it:

```bash
gcloud auth login
# Select your personal account
gcloud config set project ludex-pdf-processor
```

Then try deployment again.

## After Fixing Permissions

Once APIs are enabled (via web UI or after granting permissions), continue with:

```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
./deploy-now.sh
```


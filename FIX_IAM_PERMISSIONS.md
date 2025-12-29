# Fix IAM Permissions

Your account needs Cloud Run permissions. Here's how to fix it:

## Quick Fix: Grant Yourself Permissions

### Option 1: Via Web UI (Easiest)

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=ludex-pdf-processor
2. Click **Grant Access** (or **+ Grant Access**)
3. In "New principals", enter: `david.scebat@fiverr.com`
4. Select role: **Cloud Run Admin** (or **Owner** for full access)
5. Click **Save**

Wait 30 seconds for permissions to propagate, then try deployment again.

### Option 2: Via CLI (if you have project owner access)

```bash
gcloud projects add-iam-policy-binding ludex-pdf-processor \
  --member="user:david.scebat@fiverr.com" \
  --role="roles/run.admin"
```

## Required Roles

You need at least one of these roles:
- **Cloud Run Admin** (`roles/run.admin`) - Recommended
- **Owner** (`roles/owner`) - Full access
- **Editor** (`roles/editor`) + **Service Usage Admin** (`roles/serviceusage.serviceUsageAdmin`)

## After Granting Permissions

Wait 30 seconds, then run deployment again:

```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
./deploy-now.sh
```

## Alternative: Use Different Account

If you can't grant permissions, you can use a different Google account:

```bash
gcloud auth login
# Select a different account that has access
gcloud config set project ludex-pdf-processor
./deploy-now.sh
```


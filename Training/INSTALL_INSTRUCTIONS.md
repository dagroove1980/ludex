# Installation Instructions

## Issue: pip command not found

Your system uses `pip3` instead of `pip`. Also, package installation needs to run in your terminal (not through the sandbox).

## Quick Fix

Run these commands in your terminal:

```bash
cd /Users/david.scebat/Documents/ludex/training

# Install dependencies (use pip3)
python3 -m pip install -r requirements.txt
```

**Note**: This will download ~2-3GB of ML libraries (PyTorch, Transformers, etc.). It may take 10-20 minutes.

## Alternative: Use a Virtual Environment (Recommended)

This keeps dependencies isolated:

```bash
cd /Users/david.scebat/Documents/ludex/training

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Then activate the venv before running scripts:
```bash
source venv/bin/activate
python scripts/process_pdfs.py
```

## After Installation

Once dependencies are installed, run the training pipeline:

```bash
bash scripts/run_training_pipeline.sh
```

Or run steps individually:
```bash
python3 scripts/process_pdfs.py      # Step 1
python3 scripts/auto_labeler.py      # Step 2
python3 scripts/dataset_builder.py   # Step 3
python3 scripts/train_models.py       # Step 4
python3 scripts/evaluate.py           # Step 5
```

## Troubleshooting

- **Permission errors**: Try `python3 -m pip install --user -r requirements.txt`
- **SSL errors**: Check your network/firewall settings
- **Out of space**: ML libraries need ~5GB disk space


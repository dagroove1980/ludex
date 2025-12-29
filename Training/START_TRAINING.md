# 🚀 Start Training - Quick Guide

## Dataset Status ✅

**Found: 698 PDF files** in `Training/rules_pdfs/`

This is an excellent dataset for training! With this many PDFs, you should get:
- **~500 training examples** (after train/val/test split)
- **High-quality models** with good generalization
- **Robust performance** across different game types

## Ready to Start?

### Step 1: Install Dependencies

```bash
cd /Users/david.scebat/Documents/ludex/training
python3 -m pip install -r requirements.txt
```

**Note**: 
- Use `python3 -m pip` instead of `pip` (your system uses pip3)
- This will install PyTorch, Transformers, and other ML libraries (~2-3GB download)
- May take 10-20 minutes to download

### Step 2: Process All PDFs

This will extract features from all 698 PDFs:

```bash
python3 scripts/process_pdfs.py
```

**Expected time**: ~1-2 hours (depends on PDF sizes)
**Output**: `data/processed/*.json` - One file per PDF

### Step 3: Auto-Label

Creates training labels using heuristics:

```bash
python3 scripts/auto_labeler.py
```

**Expected time**: ~30 minutes
**Output**: `data/labeled/*.json` - Labeled training data

### Step 4: Build Datasets

Creates train/val/test splits:

```bash
python3 scripts/dataset_builder.py
```

**Expected time**: ~5 minutes
**Output**: `data/splits/*.json` - Training datasets

### Step 5: Train Models

Trains all three ML models:

```bash
python3 scripts/train_models.py
```

**Expected time**: 
- **CPU**: ~2-4 hours per model (3 models = 6-12 hours total)
- **GPU**: ~10-20 minutes per model (3 models = 30-60 minutes total)

**Tip**: You can stop and resume - models save checkpoints

### Step 6: Evaluate

Check model performance:

```bash
python3 scripts/evaluate.py
```

**Expected time**: ~5 minutes
**Output**: `evaluation/*.json` and `evaluation/*.png` - Metrics and visualizations

## Or Run Everything at Once

```bash
bash scripts/run_training_pipeline.sh
```

This will run all steps sequentially. You can stop between steps if needed.

## Expected Results

With 698 PDFs, you should achieve:
- **Section Detection**: F1 > 0.90
- **Rule Classification**: Accuracy > 0.85  
- **Section Type**: Accuracy > 0.80

## Tips

1. **Start with a subset** (optional): Test on 10-20 PDFs first
   ```bash
   # Temporarily move most PDFs, test, then move back
   ```

2. **Monitor progress**: Check `data/processed/` to see processed files

3. **GPU acceleration**: If you have a GPU, training will be 10-20x faster

4. **Memory**: Make sure you have at least 8GB RAM free

5. **Disk space**: Processed data will be ~500MB-1GB

## Troubleshooting

- **Out of memory**: Process PDFs in batches (modify script)
- **Slow processing**: Normal for 698 PDFs, be patient
- **Import errors**: Make sure you're in the training directory

## Next Steps After Training

1. Review evaluation results in `evaluation/`
2. Test parser: `python scripts/test_parser.py`
3. Deploy models: See `DEPLOY_MODELS.md`

Good luck! 🎯


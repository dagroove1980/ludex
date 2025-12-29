# Quick Start Guide - Training ML Models

## Prerequisites

```bash
cd /Users/david.scebat/Documents/ludex/training
pip install -r requirements.txt
```

## Step-by-Step Training

### 1. Process All PDFs (One-time, ~1-2 hours)

Extracts features from all PDFs in `Training/rules_pdfs/`:

```bash
python scripts/process_pdfs.py
```

**Output**: `data/processed/*.json` - One file per PDF with extracted features

### 2. Auto-Label (One-time, ~30 minutes)

Creates training labels using heuristics:

```bash
python scripts/auto_labeler.py
```

**Output**: `data/labeled/*.json` - Labeled training data

### 3. Build Datasets (~5 minutes)

Creates train/val/test splits:

```bash
python scripts/dataset_builder.py
```

**Output**: `data/splits/*.json` - Training datasets for each task

### 4. Train Models (~1-2 hours per model on CPU)

Trains all three models:

```bash
python scripts/train_models.py
```

**Output**: `models/*/` - Trained model checkpoints

**Note**: Training on CPU will be slow. Consider:
- Using a GPU if available
- Training one model at a time
- Reducing epochs/batch size for faster iteration

### 5. Evaluate (~5 minutes)

Evaluates models on test set:

```bash
python scripts/evaluate.py
```

**Output**: `evaluation/*.json` and `evaluation/*.png` - Metrics and confusion matrices

### 6. Test Locally

Test the enhanced parser:

```bash
python scripts/test_parser.py
```

## Iteration Workflow

1. **Review evaluation results** - Check confusion matrices and errors
2. **Improve auto-labeler** - Refine heuristics based on errors
3. **Re-label** - Run `auto_labeler.py` again
4. **Re-train** - Run `train_models.py` again
5. **Re-evaluate** - Check if metrics improved
6. **Repeat** until satisfied

## Tips

- **Start small**: Test on 10-20 PDFs first before processing all
- **Monitor training**: Check logs for overfitting (val loss increasing)
- **GPU acceleration**: If you have a GPU, training will be 10-20x faster
- **Model size**: DistilBERT is faster but BERT-base may be more accurate

## Troubleshooting

### Out of memory during training
- Reduce batch size in `train_models.py` (change `per_device_train_batch_size=8`)
- Use smaller model (`distilbert-base-uncased`)

### Poor model performance
- Check if you have enough training examples (need 100+ per class)
- Review auto-labeling heuristics
- Manually label some edge cases and retrain

### Models not loading
- Make sure models are trained first
- Check model directory paths in `ml_models.py`


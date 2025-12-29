#!/bin/bash

# Complete training pipeline - Run all steps in sequence

set -e

echo "🚀 Ludex ML Training Pipeline"
echo "=============================="
echo ""

cd "$(dirname "$0")/.."

# Use python3 explicitly
PYTHON_CMD="python3"

# Step 1: Process PDFs
echo "Step 1/5: Processing PDFs..."
$PYTHON_CMD scripts/process_pdfs.py
echo ""

# Step 2: Auto-label
echo "Step 2/5: Auto-labeling..."
$PYTHON_CMD scripts/auto_labeler.py
echo ""

# Step 3: Build datasets
echo "Step 3/5: Building datasets..."
$PYTHON_CMD scripts/dataset_builder.py
echo ""

# Step 4: Train models
echo "Step 4/5: Training models (this will take 1-2 hours)..."
echo "   You can stop and resume later - models save checkpoints"
$PYTHON_CMD scripts/train_models.py
echo ""

# Step 5: Evaluate
echo "Step 5/5: Evaluating models..."
$PYTHON_CMD scripts/evaluate.py
echo ""

echo "✅ Training pipeline complete!"
echo ""
echo "Next steps:"
echo "1. Review evaluation results in training/evaluation/"
echo "2. Test parser: python scripts/test_parser.py"
echo "3. If satisfied, models are ready to use in pdf-processor/"


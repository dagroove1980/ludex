#!/bin/bash

# Install training dependencies

echo "📦 Installing training dependencies..."
echo ""

cd "$(dirname "$0")"

# Use python3 -m pip to ensure we're using the right Python
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "Next step: Run the training pipeline"
echo "  bash scripts/run_training_pipeline.sh"


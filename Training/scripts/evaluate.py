#!/usr/bin/env python3
"""
Evaluate trained models on test sets.
Generates metrics, confusion matrices, and error analysis.
"""

import json
import torch
import numpy as np
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support,
    confusion_matrix, classification_report
)
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm
import sys

# Import dataset classes
sys.path.append(str(Path(__file__).parent))
from train_models import (
    SectionDetectionDataset, RuleClassificationDataset, SectionTypeDataset
)

MODELS_DIR = Path(__file__).parent.parent / "models"
DATA_DIR = Path(__file__).parent.parent / "data" / "splits"
OUTPUT_DIR = Path(__file__).parent.parent / "evaluation"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BASE_MODEL = "distilbert-base-uncased"


def evaluate_model(model_dir: Path, dataset_class, test_file: Path, task_name: str):
    """
    Evaluate a trained model on test set.
    
    Args:
        model_dir: Directory containing trained model
        dataset_class: Dataset class to use
        test_file: Path to test dataset JSON
        task_name: Name of the task (for output)
    """
    print(f"\n{'='*60}")
    print(f"Evaluating {task_name}")
    print(f"{'='*60}")
    
    if not model_dir.exists():
        print(f"❌ Model not found: {model_dir}")
        print("   Train the model first")
        return
    
    if not test_file.exists():
        print(f"❌ Test file not found: {test_file}")
        return
    
    # Load model and tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    model = AutoModelForSequenceClassification.from_pretrained(model_dir)
    model.eval()
    
    # Load test dataset
    test_dataset = dataset_class(test_file, tokenizer)
    
    print(f"Test examples: {len(test_dataset)}")
    
    # Predictions
    predictions = []
    labels = []
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    
    with torch.no_grad():
        for i in tqdm(range(len(test_dataset)), desc="Evaluating"):
            item = test_dataset[i]
            
            # Move to device
            input_ids = item["input_ids"].unsqueeze(0).to(device)
            attention_mask = item["attention_mask"].unsqueeze(0).to(device)
            
            # Predict
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            pred = torch.argmax(outputs.logits, dim=1).cpu().item()
            
            predictions.append(pred)
            labels.append(item["labels"].item())
    
    # Calculate metrics
    accuracy = accuracy_score(labels, predictions)
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, predictions, average="weighted", zero_division=0
    )
    
    print(f"\n📊 Results:")
    print(f"   Accuracy: {accuracy:.4f}")
    print(f"   Precision: {precision:.4f}")
    print(f"   Recall: {recall:.4f}")
    print(f"   F1-Score: {f1:.4f}")
    
    # Classification report
    print(f"\n📋 Classification Report:")
    print(classification_report(labels, predictions, zero_division=0))
    
    # Confusion matrix
    cm = confusion_matrix(labels, predictions)
    
    # Save results
    results = {
        "task": task_name,
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
        "confusion_matrix": cm.tolist(),
    }
    
    results_file = OUTPUT_DIR / f"{task_name}_results.json"
    with open(results_file, "w") as f:
        json.dump(results, f, indent=2)
    
    # Plot confusion matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
    plt.title(f"Confusion Matrix - {task_name}")
    plt.ylabel("True Label")
    plt.xlabel("Predicted Label")
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / f"{task_name}_confusion_matrix.png")
    plt.close()
    
    print(f"\n✅ Results saved to {OUTPUT_DIR}")
    
    return results


def evaluate_all_models():
    """Evaluate all trained models."""
    print("📊 Evaluating Models")
    print("="*60)
    
    results = {}
    
    # Evaluate section detector
    model_dir = MODELS_DIR / "section_detector"
    test_file = DATA_DIR / "section_detection_test.json"
    if model_dir.exists() and test_file.exists():
        results["section_detection"] = evaluate_model(
            model_dir, SectionDetectionDataset, test_file, "section_detection"
        )
    
    # Evaluate rule classifier
    model_dir = MODELS_DIR / "rule_classifier"
    test_file = DATA_DIR / "rule_classification_test.json"
    if model_dir.exists() and test_file.exists():
        results["rule_classification"] = evaluate_model(
            model_dir, RuleClassificationDataset, test_file, "rule_classification"
        )
    
    # Evaluate section classifier
    model_dir = MODELS_DIR / "section_classifier"
    test_file = DATA_DIR / "section_type_test.json"
    if model_dir.exists() and test_file.exists():
        results["section_classifier"] = evaluate_model(
            model_dir, SectionTypeDataset, test_file, "section_type"
        )
    
    # Summary
    print("\n" + "="*60)
    print("📊 Evaluation Summary")
    print("="*60)
    
    for task, result in results.items():
        if result:
            print(f"\n{task}:")
            print(f"  Accuracy: {result['accuracy']:.4f}")
            print(f"  F1-Score: {result['f1']:.4f}")
    
    # Save summary
    summary_file = OUTPUT_DIR / "evaluation_summary.json"
    with open(summary_file, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Summary saved to {summary_file}")


if __name__ == "__main__":
    evaluate_all_models()


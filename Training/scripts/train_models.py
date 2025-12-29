#!/usr/bin/env python3
"""
Train ML models for PDF rule extraction.
Trains three models:
1. Section Detection (binary classification)
2. Rule Classification (multi-class)
3. Section Type Classification (multi-class)
"""

import json
import torch
from pathlib import Path
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    TrainingArguments, Trainer, EarlyStoppingCallback
)
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import numpy as np
from datasets import Dataset
from tqdm import tqdm
import sys

MODELS_DIR = Path(__file__).parent.parent / "models"
DATA_DIR = Path(__file__).parent.parent / "data" / "splits"

# Model configuration
BASE_MODEL = "distilbert-base-uncased"  # Faster, smaller, good for production
# Alternative: "bert-base-uncased" or "roberta-base" for better accuracy


class SectionDetectionDataset:
    """Dataset for section heading detection."""
    
    def __init__(self, data_file: Path, tokenizer, max_length=128):
        with open(data_file, "r") as f:
            self.data = json.load(f)
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        item = self.data[idx]
        text = item["text"]
        
        # Combine text with formatting features
        features_text = f"Font size: {item.get('font_size', 0)}. Bold: {item.get('is_bold', 0)}. {text}"
        
        encoding = self.tokenizer(
            features_text,
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt"
        )
        
        return {
            "input_ids": encoding["input_ids"].flatten(),
            "attention_mask": encoding["attention_mask"].flatten(),
            "labels": torch.tensor(item["label"], dtype=torch.long)
        }


class RuleClassificationDataset:
    """Dataset for rule classification."""
    
    def __init__(self, data_file: Path, tokenizer, max_length=256):
        with open(data_file, "r") as f:
            self.data = json.load(f)
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        item = self.data[idx]
        text = item["text"]
        
        # Add context
        context_before = item.get("context_before", "")
        context_after = item.get("context_after", "")
        full_text = f"{context_before} {text} {context_after}".strip()
        
        encoding = self.tokenizer(
            full_text,
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt"
        )
        
        return {
            "input_ids": encoding["input_ids"].flatten(),
            "attention_mask": encoding["attention_mask"].flatten(),
            "labels": torch.tensor(item["label"], dtype=torch.long)
        }


class SectionTypeDataset:
    """Dataset for section type classification."""
    
    def __init__(self, data_file: Path, tokenizer, max_length=256):
        with open(data_file, "r") as f:
            self.data = json.load(f)
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        item = self.data[idx]
        heading = item.get("heading", "")
        content = item.get("content", "")
        
        # Combine heading and content
        full_text = f"{heading} {content}".strip()
        
        encoding = self.tokenizer(
            full_text,
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt"
        )
        
        return {
            "input_ids": encoding["input_ids"].flatten(),
            "attention_mask": encoding["attention_mask"].flatten(),
            "labels": torch.tensor(item["label"], dtype=torch.long)
        }


def compute_metrics(eval_pred):
    """Compute metrics for evaluation."""
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=1)
    
    accuracy = accuracy_score(labels, predictions)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, predictions, average="weighted")
    
    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
    }


def train_section_detector():
    """Train section detection model."""
    print("\n" + "="*60)
    print("Training Section Detection Model")
    print("="*60)
    
    model_dir = MODELS_DIR / "section_detector"
    model_dir.mkdir(parents=True, exist_ok=True)
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(
        BASE_MODEL,
        num_labels=2  # Binary: heading or not
    )
    
    # Load datasets
    train_file = DATA_DIR / "section_detection_train.json"
    val_file = DATA_DIR / "section_detection_val.json"
    
    if not train_file.exists() or not val_file.exists():
        print(f"❌ Dataset files not found. Run dataset_builder.py first.")
        return
    
    train_dataset = SectionDetectionDataset(train_file, tokenizer)
    val_dataset = SectionDetectionDataset(val_file, tokenizer)
    
    print(f"Training examples: {len(train_dataset)}")
    print(f"Validation examples: {len(val_dataset)}")
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=str(model_dir),
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        warmup_steps=100,
        weight_decay=0.01,
        logging_dir=str(model_dir / "logs"),
        logging_steps=50,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        save_total_limit=2,
    )
    
    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=2)],
    )
    
    # Train
    print("\n🚀 Starting training...")
    trainer.train()
    
    # Save
    model.save_pretrained(model_dir)
    tokenizer.save_pretrained(model_dir)
    
    print(f"\n✅ Model saved to {model_dir}")


def train_rule_classifier():
    """Train rule classification model."""
    print("\n" + "="*60)
    print("Training Rule Classification Model")
    print("="*60)
    
    model_dir = MODELS_DIR / "rule_classifier"
    model_dir.mkdir(parents=True, exist_ok=True)
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(
        BASE_MODEL,
        num_labels=4  # rule, example, explanation, other
    )
    
    # Load datasets
    train_file = DATA_DIR / "rule_classification_train.json"
    val_file = DATA_DIR / "rule_classification_val.json"
    
    if not train_file.exists() or not val_file.exists():
        print(f"❌ Dataset files not found. Run dataset_builder.py first.")
        return
    
    train_dataset = RuleClassificationDataset(train_file, tokenizer)
    val_dataset = RuleClassificationDataset(val_file, tokenizer)
    
    print(f"Training examples: {len(train_dataset)}")
    print(f"Validation examples: {len(val_dataset)}")
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=str(model_dir),
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        warmup_steps=100,
        weight_decay=0.01,
        logging_dir=str(model_dir / "logs"),
        logging_steps=50,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        save_total_limit=2,
    )
    
    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=2)],
    )
    
    # Train
    print("\n🚀 Starting training...")
    trainer.train()
    
    # Save
    model.save_pretrained(model_dir)
    tokenizer.save_pretrained(model_dir)
    
    print(f"\n✅ Model saved to {model_dir}")


def train_section_classifier():
    """Train section type classification model."""
    print("\n" + "="*60)
    print("Training Section Type Classification Model")
    print("="*60)
    
    model_dir = MODELS_DIR / "section_classifier"
    model_dir.mkdir(parents=True, exist_ok=True)
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(
        BASE_MODEL,
        num_labels=9  # setup, gameplay, objective, scoring, end_game, advanced, examples, faq, other
    )
    
    # Load datasets
    train_file = DATA_DIR / "section_type_train.json"
    val_file = DATA_DIR / "section_type_val.json"
    
    if not train_file.exists() or not val_file.exists():
        print(f"❌ Dataset files not found. Run dataset_builder.py first.")
        return
    
    train_dataset = SectionTypeDataset(train_file, tokenizer)
    val_dataset = SectionTypeDataset(val_file, tokenizer)
    
    print(f"Training examples: {len(train_dataset)}")
    print(f"Validation examples: {len(val_dataset)}")
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=str(model_dir),
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        warmup_steps=100,
        weight_decay=0.01,
        logging_dir=str(model_dir / "logs"),
        logging_steps=50,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        save_total_limit=2,
    )
    
    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=2)],
    )
    
    # Train
    print("\n🚀 Starting training...")
    trainer.train()
    
    # Save
    model.save_pretrained(model_dir)
    tokenizer.save_pretrained(model_dir)
    
    print(f"\n✅ Model saved to {model_dir}")


def train_all_models():
    """Train all models."""
    print("🤖 Training ML Models")
    print("="*60)
    print(f"Base model: {BASE_MODEL}")
    print(f"Device: {'cuda' if torch.cuda.is_available() else 'cpu'}")
    
    if not DATA_DIR.exists():
        print(f"❌ Data directory not found: {DATA_DIR}")
        print("   Run dataset_builder.py first")
        return
    
    # Train each model
    train_section_detector()
    train_rule_classifier()
    train_section_classifier()
    
    print("\n" + "="*60)
    print("✅ All models trained!")
    print("="*60)


if __name__ == "__main__":
    train_all_models()


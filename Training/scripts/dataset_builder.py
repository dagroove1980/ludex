#!/usr/bin/env python3
"""
Build training/validation/test datasets from labeled PDFs.
Creates datasets for each ML task: section detection, rule classification, section type.
"""

import json
import random
from pathlib import Path
from typing import Dict, List, Any, Tuple
from tqdm import tqdm
import pandas as pd
import sys

INPUT_DIR = Path(__file__).parent.parent / "data" / "labeled"
OUTPUT_DIR = Path(__file__).parent.parent / "data" / "splits"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Split ratios
TRAIN_RATIO = 0.7
VAL_RATIO = 0.15
TEST_RATIO = 0.15


def build_section_detection_dataset(labeled_files: List[Path]) -> Tuple[List[Dict], List[Dict], List[Dict]]:
    """
    Build dataset for section heading detection (binary classification).
    
    Args:
        labeled_files: List of labeled PDF files
        
    Returns:
        (train, val, test) datasets
    """
    examples = []
    
    for labeled_file in tqdm(labeled_files, desc="Building section detection dataset"):
        try:
            with open(labeled_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            blocks = data.get("labeled_blocks", [])
            
            for block in blocks:
                text = block.get("text", "").strip()
                if not text or len(text) < 3:
                    continue
                
                examples.append({
                    "text": text,
                    "label": 1 if block.get("is_section_heading", False) else 0,
                    "font_size": block.get("font_size", 0),
                    "is_bold": 1 if block.get("is_bold", False) else 0,
                    "pdf_id": data.get("pdf_id", ""),
                })
        
        except Exception as e:
            print(f"Error processing {labeled_file}: {e}")
    
    # Shuffle and split
    random.shuffle(examples)
    n = len(examples)
    train_end = int(n * TRAIN_RATIO)
    val_end = train_end + int(n * VAL_RATIO)
    
    train = examples[:train_end]
    val = examples[train_end:val_end]
    test = examples[val_end:]
    
    return train, val, test


def build_rule_classification_dataset(labeled_files: List[Path]) -> Tuple[List[Dict], List[Dict], List[Dict]]:
    """
    Build dataset for rule classification (multi-class: rule, example, explanation, other).
    
    Args:
        labeled_files: List of labeled PDF files
        
    Returns:
        (train, val, test) datasets
    """
    examples = []
    
    # Class mapping
    class_map = {"rule": 0, "example": 1, "explanation": 2, "other": 3}
    
    for labeled_file in tqdm(labeled_files, desc="Building rule classification dataset"):
        try:
            with open(labeled_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            blocks = data.get("labeled_blocks", [])
            
            for i, block in enumerate(blocks):
                text = block.get("text", "").strip()
                text_type = block.get("text_type")
                
                # Skip headings and empty text
                if block.get("is_section_heading", False) or not text or len(text) < 10:
                    continue
                
                if text_type not in class_map:
                    continue
                
                # Get context (previous and next blocks)
                context_before = ""
                context_after = ""
                
                if i > 0:
                    prev_text = blocks[i-1].get("text", "").strip()
                    if not blocks[i-1].get("is_section_heading", False):
                        context_before = prev_text[-200:]  # Last 200 chars
                
                if i < len(blocks) - 1:
                    next_text = blocks[i+1].get("text", "").strip()
                    if not blocks[i+1].get("is_section_heading", False):
                        context_after = next_text[:200]  # First 200 chars
                
                examples.append({
                    "text": text,
                    "context_before": context_before,
                    "context_after": context_after,
                    "label": class_map[text_type],
                    "label_name": text_type,
                    "pdf_id": data.get("pdf_id", ""),
                })
        
        except Exception as e:
            print(f"Error processing {labeled_file}: {e}")
    
    # Shuffle and split
    random.shuffle(examples)
    n = len(examples)
    train_end = int(n * TRAIN_RATIO)
    val_end = train_end + int(n * VAL_RATIO)
    
    train = examples[:train_end]
    val = examples[train_end:val_end]
    test = examples[val_end:]
    
    return train, val, test


def build_section_type_dataset(labeled_files: List[Path]) -> Tuple[List[Dict], List[Dict], List[Dict]]:
    """
    Build dataset for section type classification.
    
    Args:
        labeled_files: List of labeled PDF files
        
    Returns:
        (train, val, test) datasets
    """
    examples = []
    
    # Section type mapping
    section_types = ["setup", "gameplay", "objective", "scoring", "end_game", "advanced", "examples", "faq", "other"]
    type_map = {st: i for i, st in enumerate(section_types)}
    
    for labeled_file in tqdm(labeled_files, desc="Building section type dataset"):
        try:
            with open(labeled_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            blocks = data.get("labeled_blocks", [])
            
            # Group blocks by section
            current_section = None
            section_blocks = []
            
            for block in blocks:
                if block.get("is_section_heading", False):
                    # Save previous section
                    if current_section and section_blocks:
                        section_type = current_section.get("section_type", "other")
                        section_text = " ".join([b.get("text", "") for b in section_blocks[:10]])  # First 10 blocks
                        
                        examples.append({
                            "heading": current_section.get("text", ""),
                            "content": section_text[:500],  # First 500 chars
                            "label": type_map.get(section_type, type_map["other"]),
                            "label_name": section_type,
                            "pdf_id": data.get("pdf_id", ""),
                        })
                    
                    # Start new section
                    current_section = block
                    section_blocks = []
                else:
                    section_blocks.append(block)
            
            # Save last section
            if current_section and section_blocks:
                section_type = current_section.get("section_type", "other")
                section_text = " ".join([b.get("text", "") for b in section_blocks[:10]])
                
                examples.append({
                    "heading": current_section.get("text", ""),
                    "content": section_text[:500],
                    "label": type_map.get(section_type, type_map["other"]),
                    "label_name": section_type,
                    "pdf_id": data.get("pdf_id", ""),
                })
        
        except Exception as e:
            print(f"Error processing {labeled_file}: {e}")
    
    # Shuffle and split
    random.shuffle(examples)
    n = len(examples)
    train_end = int(n * TRAIN_RATIO)
    val_end = train_end + int(n * VAL_RATIO)
    
    train = examples[:train_end]
    val = examples[train_end:val_end]
    test = examples[val_end:]
    
    return train, val, test


def save_datasets(train: List[Dict], val: List[Dict], test: List[Dict], task_name: str):
    """Save datasets to JSON files."""
    for split_name, split_data in [("train", train), ("val", val), ("test", test)]:
        output_file = OUTPUT_DIR / f"{task_name}_{split_name}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(split_data, f, indent=2, ensure_ascii=False)
        
        print(f"   {split_name}: {len(split_data)} examples")


def build_all_datasets():
    """Build all training datasets."""
    print("📊 Building training datasets...")
    
    labeled_files = list(INPUT_DIR.glob("*.json"))
    print(f"Found {len(labeled_files)} labeled PDFs")
    
    if not labeled_files:
        print(f"❌ No labeled PDFs found in {INPUT_DIR}")
        print("   Run auto_labeler.py first")
        return
    
    # Set random seed for reproducibility
    random.seed(42)
    
    # Build section detection dataset
    print("\n1. Section Detection Dataset:")
    train, val, test = build_section_detection_dataset(labeled_files)
    save_datasets(train, val, test, "section_detection")
    
    # Build rule classification dataset
    print("\n2. Rule Classification Dataset:")
    train, val, test = build_rule_classification_dataset(labeled_files)
    save_datasets(train, val, test, "rule_classification")
    
    # Build section type dataset
    print("\n3. Section Type Dataset:")
    train, val, test = build_section_type_dataset(labeled_files)
    save_datasets(train, val, test, "section_type")
    
    print(f"\n✅ Dataset building complete!")
    print(f"   Output directory: {OUTPUT_DIR}")


if __name__ == "__main__":
    if not INPUT_DIR.exists():
        print(f"❌ Labeled data directory not found: {INPUT_DIR}")
        print("   Run auto_labeler.py first")
        sys.exit(1)
    
    build_all_datasets()


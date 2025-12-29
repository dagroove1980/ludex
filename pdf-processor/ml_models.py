"""
ML Model loading and inference for PDF rule extraction.
Loads trained models and provides prediction functions.
"""

import torch
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from typing import Dict, List, Any, Optional
import os

# Model paths (relative to this file)
MODELS_BASE_DIR = Path(__file__).parent.parent / "training" / "models"

# Model instances (cached)
_section_detector = None
_section_detector_tokenizer = None
_rule_classifier = None
_rule_classifier_tokenizer = None
_section_classifier = None
_section_classifier_tokenizer = None


def load_section_detector():
    """Load section detection model."""
    global _section_detector, _section_detector_tokenizer
    
    if _section_detector is not None:
        return _section_detector, _section_detector_tokenizer
    
    model_dir = MODELS_BASE_DIR / "section_detector"
    
    if not model_dir.exists():
        return None, None
    
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_dir)
        model = AutoModelForSequenceClassification.from_pretrained(model_dir)
        model.eval()
        
        _section_detector = model
        _section_detector_tokenizer = tokenizer
        
        return model, tokenizer
    except Exception as e:
        print(f"Error loading section detector: {e}")
        return None, None


def load_rule_classifier():
    """Load rule classification model."""
    global _rule_classifier, _rule_classifier_tokenizer
    
    if _rule_classifier is not None:
        return _rule_classifier, _rule_classifier_tokenizer
    
    model_dir = MODELS_BASE_DIR / "rule_classifier"
    
    if not model_dir.exists():
        return None, None
    
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_dir)
        model = AutoModelForSequenceClassification.from_pretrained(model_dir)
        model.eval()
        
        _rule_classifier = model
        _rule_classifier_tokenizer = tokenizer
        
        return model, tokenizer
    except Exception as e:
        print(f"Error loading rule classifier: {e}")
        return None, None


def load_section_classifier():
    """Load section type classification model."""
    global _section_classifier, _section_classifier_tokenizer
    
    if _section_classifier is not None:
        return _section_classifier, _section_classifier_tokenizer
    
    model_dir = MODELS_BASE_DIR / "section_classifier"
    
    if not model_dir.exists():
        return None, None
    
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_dir)
        model = AutoModelForSequenceClassification.from_pretrained(model_dir)
        model.eval()
        
        _section_classifier = model
        _section_classifier_tokenizer = tokenizer
        
        return model, tokenizer
    except Exception as e:
        print(f"Error loading section classifier: {e}")
        return None, None


def predict_section_heading(text: str, font_size: float = 0, is_bold: bool = False) -> Dict[str, Any]:
    """
    Predict if text is a section heading.
    
    Args:
        text: Text to classify
        font_size: Font size (for feature)
        is_bold: Whether text is bold
        
    Returns:
        Dictionary with prediction and confidence
    """
    model, tokenizer = load_section_detector()
    
    if model is None or tokenizer is None:
        # Fallback to pattern-based
        return {"is_heading": False, "confidence": 0.5, "method": "pattern"}
    
    try:
        # Prepare input
        features_text = f"Font size: {font_size}. Bold: {1 if is_bold else 0}. {text}"
        
        inputs = tokenizer(
            features_text,
            truncation=True,
            padding="max_length",
            max_length=128,
            return_tensors="pt"
        )
        
        # Predict
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            pred = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred].item()
        
        return {
            "is_heading": bool(pred == 1),
            "confidence": float(confidence),
            "method": "ml"
        }
    except Exception as e:
        print(f"Error in section heading prediction: {e}")
        return {"is_heading": False, "confidence": 0.5, "method": "pattern"}


def predict_text_type(text: str, context_before: str = "", context_after: str = "") -> Dict[str, Any]:
    """
    Predict text type: rule, example, explanation, or other.
    
    Args:
        text: Text to classify
        context_before: Previous text for context
        context_after: Next text for context
        
    Returns:
        Dictionary with prediction and confidence
    """
    model, tokenizer = load_rule_classifier()
    
    if model is None or tokenizer is None:
        # Fallback to pattern-based
        return {"text_type": "other", "confidence": 0.5, "method": "pattern"}
    
    try:
        # Prepare input with context
        full_text = f"{context_before} {text} {context_after}".strip()
        
        inputs = tokenizer(
            full_text,
            truncation=True,
            padding="max_length",
            max_length=256,
            return_tensors="pt"
        )
        
        # Predict
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            pred = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred].item()
        
        # Map to label
        label_map = {0: "rule", 1: "example", 2: "explanation", 3: "other"}
        text_type = label_map.get(pred, "other")
        
        return {
            "text_type": text_type,
            "confidence": float(confidence),
            "method": "ml"
        }
    except Exception as e:
        print(f"Error in text type prediction: {e}")
        return {"text_type": "other", "confidence": 0.5, "method": "pattern"}


def predict_section_type(heading: str, content: str = "") -> Dict[str, Any]:
    """
    Predict section type: setup, gameplay, scoring, etc.
    
    Args:
        heading: Section heading text
        content: Section content (optional)
        
    Returns:
        Dictionary with prediction and confidence
    """
    model, tokenizer = load_section_classifier()
    
    if model is None or tokenizer is None:
        # Fallback to pattern-based
        return {"section_type": "other", "confidence": 0.5, "method": "pattern"}
    
    try:
        # Prepare input
        full_text = f"{heading} {content}".strip()
        
        inputs = tokenizer(
            full_text,
            truncation=True,
            padding="max_length",
            max_length=256,
            return_tensors="pt"
        )
        
        # Predict
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            pred = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred].item()
        
        # Map to label
        label_map = {
            0: "setup", 1: "gameplay", 2: "objective", 3: "scoring",
            4: "end_game", 5: "advanced", 6: "examples", 7: "faq", 8: "other"
        }
        section_type = label_map.get(pred, "other")
        
        return {
            "section_type": section_type,
            "confidence": float(confidence),
            "method": "ml"
        }
    except Exception as e:
        print(f"Error in section type prediction: {e}")
        return {"section_type": "other", "confidence": 0.5, "method": "pattern"}


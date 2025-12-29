#!/usr/bin/env python3
"""
Auto-label extracted PDF features using heuristics and patterns.
Creates training labels for section detection, rule classification, and section type.
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any
from tqdm import tqdm
import sys

INPUT_DIR = Path(__file__).parent.parent / "data" / "processed"
OUTPUT_DIR = Path(__file__).parent.parent / "data" / "labeled"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# Common section titles and their types
SECTION_KEYWORDS = {
    "setup": ["setup", "set up", "setting up", "preparation", "components", "contents", "what's in the box"],
    "gameplay": ["gameplay", "how to play", "playing the game", "rules", "rules of play", "game rules"],
    "objective": ["objective", "goal", "winning", "victory", "how to win"],
    "scoring": ["scoring", "points", "victory points", "scoring points"],
    "end_game": ["end of game", "game end", "ending the game", "end game"],
    "advanced": ["advanced rules", "optional rules", "variants", "variant rules"],
    "examples": ["examples", "example", "example play", "sample"],
    "faq": ["faq", "frequently asked questions", "questions", "troubleshooting"],
}

# Rule indicators
RULE_INDICATORS = [
    r"\b(must|should|cannot|may not|do not|don't|cannot|shall|will)\b",
    r"^\d+[\.\)]\s",  # Numbered lists
    r"^[•\-\*]\s",  # Bullet points
    r"\b(place|put|set|choose|select|draw|shuffle|deal)\b",  # Action verbs
]

# Example indicators
EXAMPLE_INDICATORS = [
    r"\b(for example|e\.g\.|such as|like when|imagine|suppose)\b",
    r"^example:",
    r"^for instance",
]

# Explanation indicators
EXPLANATION_INDICATORS = [
    r"\b(because|since|this means|in other words|that is|i\.e\.)\b",
    r"\b(if|when|then)\b.*\b(because|since)\b",
]


def is_section_heading(block: Dict[str, Any], all_blocks: List[Dict[str, Any]]) -> bool:
    """
    Determine if a text block is a section heading.
    
    Args:
        block: Text block to check
        all_blocks: All blocks for context
        
    Returns:
        True if likely a section heading
    """
    text = block.get("text", "").strip()
    if not text or len(text) > 200:
        return False
    
    # Check font size (headings are usually larger)
    font_sizes = [b.get("font_size", 0) for b in all_blocks if b.get("font_size")]
    if font_sizes:
        avg_font_size = sum(font_sizes) / len(font_sizes)
        if block.get("font_size", 0) > avg_font_size * 1.2:
            return True
    
    # Check if bold
    if block.get("is_bold", False) and len(text) < 100:
        return True
    
    # Check common patterns
    if re.match(r"^[A-Z][A-Z\s]+$", text):  # ALL CAPS
        return True
    
    if re.match(r"^\d+\.\s+[A-Z]", text):  # Numbered heading
        return True
    
    # Check if matches section keywords
    text_lower = text.lower()
    for section_type, keywords in SECTION_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower and len(text) < 100:
                return True
    
    return False


def classify_section_type(heading_text: str) -> str:
    """
    Classify section type based on heading text.
    
    Args:
        heading_text: Section heading text
        
    Returns:
        Section type (setup, gameplay, scoring, etc.)
    """
    text_lower = heading_text.lower()
    
    for section_type, keywords in SECTION_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                return section_type
    
    return "other"


def classify_text_type(text: str) -> str:
    """
    Classify text as rule, example, or explanation.
    
    Args:
        text: Text to classify
        
    Returns:
        Classification: "rule", "example", "explanation", or "other"
    """
    text_lower = text.lower()
    
    # Check for example indicators
    for pattern in EXAMPLE_INDICATORS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            return "example"
    
    # Check for explanation indicators
    for pattern in EXPLANATION_INDICATORS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            return "explanation"
    
    # Check for rule indicators
    rule_score = 0
    for pattern in RULE_INDICATORS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            rule_score += 1
    
    if rule_score >= 1:
        return "rule"
    
    # Default to other
    return "other"


def auto_label_pdf(processed_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Auto-label a processed PDF.
    
    Args:
        processed_data: Processed PDF data with blocks
        
    Returns:
        Labeled data with annotations
    """
    blocks = processed_data.get("blocks", [])
    labeled_blocks = []
    
    current_section_type = "other"
    
    for i, block in enumerate(blocks):
        text = block.get("text", "").strip()
        if not text:
            continue
        
        # Check if this is a section heading
        is_heading = is_section_heading(block, blocks)
        
        labeled_block = {
            **block,
            "is_section_heading": is_heading,
            "section_type": None,
            "text_type": None,
        }
        
        if is_heading:
            # Classify section type
            section_type = classify_section_type(text)
            labeled_block["section_type"] = section_type
            current_section_type = section_type
        else:
            # Classify text type (rule, example, explanation)
            text_type = classify_text_type(text)
            labeled_block["text_type"] = text_type
            labeled_block["section_type"] = current_section_type
        
        labeled_blocks.append(labeled_block)
    
    return {
        **processed_data,
        "labeled_blocks": labeled_blocks,
    }


def label_all_pdfs():
    """Label all processed PDFs."""
    print("🏷️  Auto-labeling PDFs...")
    
    processed_files = list(INPUT_DIR.glob("*.json"))
    print(f"Found {len(processed_files)} processed PDFs")
    
    if not processed_files:
        print(f"❌ No processed PDFs found in {INPUT_DIR}")
        print("   Run process_pdfs.py first")
        return
    
    labeled_count = 0
    
    for processed_file in tqdm(processed_files, desc="Labeling"):
        try:
            # Load processed data
            with open(processed_file, "r", encoding="utf-8") as f:
                processed_data = json.load(f)
            
            # Auto-label
            labeled_data = auto_label_pdf(processed_data)
            
            # Save labeled data
            output_file = OUTPUT_DIR / processed_file.name
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(labeled_data, f, indent=2, ensure_ascii=False)
            
            labeled_count += 1
            
        except Exception as e:
            print(f"\n❌ Error labeling {processed_file}: {e}")
    
    print(f"\n✅ Labeling complete!")
    print(f"   Labeled: {labeled_count} PDFs")
    print(f"   Output directory: {OUTPUT_DIR}")


if __name__ == "__main__":
    if not INPUT_DIR.exists():
        print(f"❌ Processed data directory not found: {INPUT_DIR}")
        print("   Run process_pdfs.py first")
        sys.exit(1)
    
    label_all_pdfs()


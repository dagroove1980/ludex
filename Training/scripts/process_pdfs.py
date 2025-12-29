#!/usr/bin/env python3
"""
Process all PDFs and extract features for training.
Extracts text blocks with font information, position, and formatting.
"""

import os
import json
import pdfplumber
import fitz  # PyMuPDF
from pathlib import Path
from tqdm import tqdm
from typing import Dict, List, Any
import sys

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent.parent))

# Path to PDFs
PDFS_DIR = Path(__file__).parent.parent.parent / "Training" / "rules_pdfs"
OUTPUT_DIR = Path(__file__).parent.parent / "data" / "processed"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def extract_text_blocks(pdf_path: Path) -> List[Dict[str, Any]]:
    """
    Extract text blocks with formatting information from PDF.
    
    Args:
        pdf_path: Path to PDF file
        
    Returns:
        List of text blocks with features
    """
    blocks = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                # Extract text with character-level formatting
                chars = page.chars
                if not chars:
                    continue
                
                # Group characters into blocks by font and position
                current_block = {
                    "text": "",
                    "font_size": None,
                    "font_name": None,
                    "is_bold": False,
                    "page": page_num,
                    "x0": None,
                    "y0": None,
                    "x1": None,
                    "y1": None,
                }
                
                for char in chars:
                    char_text = char.get("text", "")
                    char_size = char.get("size", 0)
                    char_font = char.get("fontname", "")
                    char_bold = "Bold" in char_font or "bold" in char_font.lower()
                    char_x0 = char.get("x0", 0)
                    char_y0 = char.get("top", 0)
                    char_x1 = char.get("x1", 0)
                    char_y1 = char.get("bottom", 0)
                    
                    # Start new block if font changes significantly
                    if (current_block["font_size"] and 
                        abs(char_size - current_block["font_size"]) > 2):
                        if current_block["text"].strip():
                            blocks.append(current_block.copy())
                        current_block = {
                            "text": char_text,
                            "font_size": char_size,
                            "font_name": char_font,
                            "is_bold": char_bold,
                            "page": page_num,
                            "x0": char_x0,
                            "y0": char_y0,
                            "x1": char_x1,
                            "y1": char_y1,
                        }
                    else:
                        # Continue current block
                        if not current_block["font_size"]:
                            current_block["font_size"] = char_size
                            current_block["font_name"] = char_font
                            current_block["is_bold"] = char_bold
                            current_block["x0"] = char_x0
                            current_block["y0"] = char_y0
                            current_block["x1"] = char_x1
                            current_block["y1"] = char_y1
                        
                        current_block["text"] += char_text
                        # Update bounding box
                        if char_x0 < current_block["x0"]:
                            current_block["x0"] = char_x0
                        if char_y0 < current_block["y0"]:
                            current_block["y0"] = char_y0
                        if char_x1 > current_block["x1"]:
                            current_block["x1"] = char_x1
                        if char_y1 > current_block["y1"]:
                            current_block["y1"] = char_y1
                
                # Add last block
                if current_block["text"].strip():
                    blocks.append(current_block)
        
        # Also extract full page text for context
        with fitz.open(pdf_path) as doc:
            page_texts = []
            for page_num, page in enumerate(doc, 1):
                page_texts.append({
                    "page": page_num,
                    "full_text": page.get_text(),
                })
        
        return {
            "blocks": blocks,
            "page_texts": page_texts,
            "total_pages": len(page_texts),
        }
        
    except Exception as e:
        print(f"Error processing {pdf_path}: {e}")
        return {"blocks": [], "page_texts": [], "total_pages": 0}


def process_all_pdfs():
    """Process all PDFs in the rules_pdfs directory."""
    print("🔍 Finding all PDFs...")
    
    pdf_files = list(PDFS_DIR.rglob("*.pdf"))
    print(f"Found {len(pdf_files)} PDF files")
    
    print("\n📄 Processing PDFs...")
    processed_count = 0
    error_count = 0
    
    for pdf_path in tqdm(pdf_files, desc="Processing"):
        try:
            # Create relative path for ID
            rel_path = pdf_path.relative_to(PDFS_DIR)
            pdf_id = str(rel_path).replace("/", "_").replace(".pdf", "")
            
            # Extract features
            features = extract_text_blocks(pdf_path)
            
            # Add metadata
            features["pdf_id"] = pdf_id
            features["pdf_path"] = str(pdf_path)
            features["file_name"] = pdf_path.name
            
            # Save to JSON
            output_file = OUTPUT_DIR / f"{pdf_id}.json"
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(features, f, indent=2, ensure_ascii=False)
            
            processed_count += 1
            
        except Exception as e:
            print(f"\n❌ Error processing {pdf_path}: {e}")
            error_count += 1
    
    print(f"\n✅ Processing complete!")
    print(f"   Processed: {processed_count}")
    print(f"   Errors: {error_count}")
    print(f"   Output directory: {OUTPUT_DIR}")


if __name__ == "__main__":
    if not PDFS_DIR.exists():
        print(f"❌ PDFs directory not found: {PDFS_DIR}")
        print("   Make sure Training/rules_pdfs exists")
        sys.exit(1)
    
    process_all_pdfs()


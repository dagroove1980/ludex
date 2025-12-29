#!/usr/bin/env python3
"""
Test the enhanced parser on sample PDFs locally.
Compares pattern-based vs ML-enhanced parsing.
"""

import sys
from pathlib import Path
import json

# Add parent directories to path
sys.path.append(str(Path(__file__).parent.parent.parent / "pdf-processor"))

from pdf_extractor import extract_pdf_structure
from rule_parser import parse_rules

# Test PDFs
TEST_PDFS = [
    Path(__file__).parent.parent.parent / "Training" / "rules_pdfs" / "a-game-of-thrones-the-board-game-second-edition" / "A_Game_of_Thrones_The_Board_Game_Second_Edition_Rules.pdf",
    Path(__file__).parent.parent.parent / "Training" / "rules_pdfs" / "arkham-horror-the-card-game" / "Arkham_Horror_The_Card_Game_Rulebook.pdf",
]


def test_parser(pdf_path: Path):
    """Test parser on a single PDF."""
    print(f"\n{'='*60}")
    print(f"Testing: {pdf_path.name}")
    print(f"{'='*60}")
    
    if not pdf_path.exists():
        print(f"❌ PDF not found: {pdf_path}")
        return
    
    try:
        # Extract structure
        print("📄 Extracting PDF structure...")
        pdf_structure = extract_pdf_structure(str(pdf_path))
        
        print(f"   Pages: {pdf_structure.get('total_pages', 0)}")
        print(f"   Blocks: {len(pdf_structure.get('pages_data', []))}")
        print(f"   Headings detected: {len(pdf_structure.get('structure', {}).get('headings', []))}")
        
        # Parse rules
        print("\n🔍 Parsing rules...")
        sections = parse_rules(pdf_structure)
        
        print(f"\n✅ Parsed {len(sections)} sections:")
        for i, section in enumerate(sections[:5], 1):  # Show first 5
            print(f"\n   {i}. {section.get('title', 'Untitled')}")
            print(f"      Type: {section.get('section_type', 'unknown')}")
            print(f"      Content length: {len(section.get('content', ''))} chars")
            if section.get('subsections'):
                print(f"      Subsections: {len(section['subsections'])}")
        
        if len(sections) > 5:
            print(f"\n   ... and {len(sections) - 5} more sections")
        
        return sections
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_all():
    """Test parser on all test PDFs."""
    print("🧪 Testing Enhanced Parser")
    print("="*60)
    
    results = {}
    
    for pdf_path in TEST_PDFS:
        if pdf_path.exists():
            sections = test_parser(pdf_path)
            if sections:
                results[pdf_path.name] = {
                    "sections_count": len(sections),
                    "has_subsections": any(s.get("subsections") for s in sections),
                }
        else:
            print(f"\n⚠️  PDF not found: {pdf_path}")
    
    # Summary
    print("\n" + "="*60)
    print("📊 Test Summary")
    print("="*60)
    
    for pdf_name, result in results.items():
        print(f"\n{pdf_name}:")
        print(f"  Sections: {result['sections_count']}")
        print(f"  Has subsections: {result['has_subsections']}")
    
    print("\n✅ Testing complete!")


if __name__ == "__main__":
    test_all()


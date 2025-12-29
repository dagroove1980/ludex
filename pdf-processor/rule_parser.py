import re
from typing import Dict, List, Any
import sys
from pathlib import Path

# Try to import ML models (may not be available if models not trained yet)
try:
    from ml_models import (
        predict_section_heading, predict_text_type, predict_section_type
    )
    ML_MODELS_AVAILABLE = True
except ImportError:
    ML_MODELS_AVAILABLE = False
    print("ML models not available, using pattern-based detection only")


def parse_rules(pdf_structure: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Parse PDF structure into organized rule sections.
    
    Args:
        pdf_structure: Dictionary from pdf_extractor with text and structure
        
    Returns:
        List of sections with subsections, organized hierarchically
    """
    full_text = pdf_structure.get("full_text", "")
    structure = pdf_structure.get("structure", {})
    headings = structure.get("headings", [])
    
    # Split text into sections based on headings
    sections = []
    
    if not headings:
        # Fallback: try to detect sections by common patterns
        sections = detect_sections_by_patterns(full_text)
    else:
        # Use detected headings to create sections (with ML enhancement)
        sections = create_sections_from_headings(full_text, headings, pdf_structure)
    
    # Clean and organize sections
    sections = organize_sections(sections)
    
    return sections


def detect_sections_by_patterns(text: str) -> List[Dict[str, Any]]:
    """
    Detect sections using common board game rulebook patterns.
    
    Args:
        text: Full PDF text
        
    Returns:
        List of detected sections
    """
    sections = []
    
    # Common section titles in board games
    common_sections = [
        "Setup", "Set Up", "Setting Up",
        "Gameplay", "How to Play", "Playing the Game",
        "Components", "Contents", "What's in the Box",
        "Objective", "Goal", "Winning",
        "Scoring", "Points", "Victory Points",
        "End of Game", "Game End", "Ending the Game",
        "Rules", "Rules of Play", "Game Rules",
        "Advanced Rules", "Optional Rules", "Variants",
        "Examples", "Example", "Example Play",
    ]
    
    # Split text by common section markers
    text_lower = text.lower()
    section_patterns = []
    
    for section_name in common_sections:
        # Find all occurrences (case-insensitive)
        pattern = re.compile(re.escape(section_name), re.IGNORECASE)
        for match in pattern.finditer(text):
            section_patterns.append({
                "title": section_name,
                "position": match.start(),
                "level": 1,
            })
    
    # Sort by position
    section_patterns.sort(key=lambda x: x["position"])
    
    # Extract content between sections
    for i, pattern in enumerate(section_patterns):
        start_pos = pattern["position"]
        end_pos = section_patterns[i + 1]["position"] if i + 1 < len(section_patterns) else len(text)
        
        content = text[start_pos:end_pos].strip()
        # Remove the section title from content
        content = re.sub(re.escape(pattern["title"]), "", content, flags=re.IGNORECASE).strip()
        
        sections.append({
            "id": slugify(pattern["title"]),
            "title": pattern["title"],
            "content": content,
            "order": i + 1,
            "subsections": [],
        })
    
    # If no sections found, create a single "Rules" section
    if not sections:
        sections.append({
            "id": "rules",
            "title": "Rules",
            "content": text,
            "order": 1,
            "subsections": [],
        })
    
    return sections


def create_sections_from_headings(text: str, headings: List[Dict[str, Any]], pdf_structure: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """
    Create sections from detected headings, using ML models if available.
    
    Args:
        text: Full PDF text
        headings: List of detected headings with levels
        pdf_structure: Full PDF structure (for ML model access to blocks)
        
    Returns:
        List of sections organized by heading hierarchy
    """
    sections = []
    current_section = None
    
    # Get blocks if available for ML predictions
    blocks = pdf_structure.get("pages_data", []) if pdf_structure else []
    all_blocks = []
    for page_data in blocks:
        all_blocks.extend(page_data.get("chars", []))
    
    # Sort headings by position
    headings_sorted = sorted(headings, key=lambda h: (h["page"], h.get("position", 0)))
    
    for i, heading in enumerate(headings_sorted):
        heading_text = heading["text"]
        heading_level = heading.get("level", 1)
        
        # Use ML model to refine section type if available
        section_type = "other"
        if ML_MODELS_AVAILABLE:
            try:
                # Get heading block for font info
                heading_block = None
                for block in all_blocks:
                    if heading_text in block.get("text", ""):
                        heading_block = block
                        break
                
                # Predict section type
                ml_result = predict_section_type(heading_text, "")
                if ml_result.get("confidence", 0) > 0.6:  # Use ML if confident
                    section_type = ml_result.get("section_type", "other")
            except Exception as e:
                print(f"ML prediction error: {e}")
        
        # Find content for this heading
        start_pos = find_heading_position(text, heading_text)
        next_heading = headings_sorted[i + 1] if i + 1 < len(headings_sorted) else None
        end_pos = find_heading_position(text, next_heading["text"]) if next_heading else len(text)
        
        content = text[start_pos:end_pos].strip() if start_pos < end_pos else ""
        # Remove heading from content
        content = re.sub(re.escape(heading_text), "", content, flags=re.IGNORECASE).strip()
        
        section_data = {
            "id": slugify(heading_text),
            "title": heading_text,
            "content": content,
            "order": len(sections) + 1,
            "subsections": [],
            "section_type": section_type,
        }
        
        if heading_level == 1:
            # Main section
            if current_section:
                sections.append(current_section)
            current_section = section_data
        else:
            # Subsection
            if current_section:
                current_section["subsections"].append({
                    "id": slugify(heading_text),
                    "title": heading_text,
                    "content": content,
                    "order": len(current_section["subsections"]) + 1,
                })
            else:
                # No parent section, treat as main section
                sections.append(section_data)
    
    # Add last section
    if current_section:
        sections.append(current_section)
    
    return sections


def find_heading_position(text: str, heading: str) -> int:
    """
    Find the position of a heading in text.
    
    Args:
        text: Full text
        heading: Heading text to find
        
    Returns:
        Position index, or 0 if not found
    """
    if not heading:
        return len(text)
    
    # Try exact match first
    pos = text.find(heading)
    if pos != -1:
        return pos
    
    # Try case-insensitive
    pattern = re.compile(re.escape(heading), re.IGNORECASE)
    match = pattern.search(text)
    if match:
        return match.start()
    
    return 0


def organize_sections(sections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Clean and organize sections, removing empty ones and fixing hierarchy.
    
    Args:
        sections: List of sections
        
    Returns:
        Cleaned and organized sections
    """
    organized = []
    
    for section in sections:
        # Skip empty sections
        if not section.get("content", "").strip() and not section.get("subsections"):
            continue
        
        # Clean content
        content = section.get("content", "").strip()
        content = clean_text(content)
        
        # Clean subsections
        subsections = []
        for sub in section.get("subsections", []):
            sub_content = sub.get("content", "").strip()
            sub_content = clean_text(sub_content)
            if sub_content:
                subsections.append({
                    "id": sub.get("id", slugify(sub.get("title", ""))),
                    "title": sub.get("title", "").strip(),
                    "content": sub_content,
                    "order": sub.get("order", 0),
                })
        
        organized.append({
            "id": section.get("id", slugify(section.get("title", ""))),
            "title": section.get("title", "").strip(),
            "content": content,
            "order": section.get("order", 0),
            "subsections": subsections,
        })
    
    return organized


def clean_text(text: str) -> str:
    """
    Clean extracted text by removing excessive whitespace and formatting artifacts.
    
    Args:
        text: Raw text
        
    Returns:
        Cleaned text
    """
    if not text:
        return ""
    
    # Remove excessive newlines (more than 2 consecutive)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Remove excessive spaces
    text = re.sub(r' {2,}', ' ', text)
    
    # Remove page markers
    text = re.sub(r'--- Page \d+ ---', '', text)
    
    # Trim whitespace
    text = text.strip()
    
    return text


def slugify(text: str) -> str:
    """
    Convert text to URL-friendly slug.
    
    Args:
        text: Text to slugify
        
    Returns:
        Slug string
    """
    if not text:
        return "section"
    
    # Convert to lowercase
    slug = text.lower()
    
    # Replace spaces and special chars with hyphens
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    
    return slug or "section"


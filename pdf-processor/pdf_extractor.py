import pdfplumber
import fitz  # PyMuPDF
import requests
from io import BytesIO
from typing import Dict, List, Any


def extract_pdf_structure(pdf_url: str) -> Dict[str, Any]:
    """
    Extract text and structure from PDF using pdfplumber and PyMuPDF.
    
    Args:
        pdf_url: URL to the PDF file
        
    Returns:
        Dictionary with extracted text, structure, and metadata
    """
    try:
        # Download PDF
        response = requests.get(pdf_url, timeout=60)
        response.raise_for_status()
        pdf_bytes = BytesIO(response.content)
        
        # Extract with pdfplumber for text and structure
        pages_data = []
        total_text = ""
        has_tables = False
        has_images = False
        
        with pdfplumber.open(pdf_bytes) as pdf:
            total_pages = len(pdf.pages)
            
            for page_num, page in enumerate(pdf.pages, 1):
                page_text = page.extract_text() or ""
                total_text += f"\n\n--- Page {page_num} ---\n\n{page_text}"
                
                # Check for tables
                tables = page.extract_tables()
                if tables:
                    has_tables = True
                    for table in tables:
                        # Convert table to markdown-like format
                        table_text = "\n".join([" | ".join(str(cell) if cell else "" for cell in row) for row in table])
                        total_text += f"\n\n[Table]\n{table_text}\n"
                
                # Extract text with formatting info
                chars = page.chars
                if chars:
                    pages_data.append({
                        "page": page_num,
                        "text": page_text,
                        "chars": chars,  # For font size detection
                    })
        
        # Use PyMuPDF for additional structure detection
        pdf_bytes.seek(0)
        doc = fitz.open(stream=pdf_bytes.read(), filetype="pdf")
        
        # Check for images
        for page in doc:
            image_list = page.get_images()
            if image_list:
                has_images = True
                break
        
        # Extract headings and structure using font analysis (try ML if available)
        try:
            from ml_models import predict_section_heading
            use_ml = True
        except ImportError:
            use_ml = False
        
        structure = analyze_structure(pages_data, use_ml=use_ml)
        
        return {
            "full_text": total_text,
            "pages_data": pages_data,
            "total_pages": total_pages,
            "has_tables": has_tables,
            "has_images": has_images,
            "structure": structure,
        }
        
    except Exception as e:
        raise Exception(f"PDF extraction failed: {str(e)}")


def analyze_structure(pages_data: List[Dict], use_ml: bool = False) -> Dict[str, Any]:
    """
    Analyze PDF structure to detect headings, sections, and hierarchy.
    
    Args:
        pages_data: List of page data with text and character information
        
    Returns:
        Dictionary with detected structure
    """
    structure = {
        "headings": [],
        "sections": [],
    }
    
    # Collect all text blocks with font information
    all_blocks = []
    for page_data in pages_data:
        chars = page_data.get("chars", [])
        if not chars:
            continue
        
        # Group characters by font size and style
        current_block = {
            "text": "",
            "font_size": None,
            "is_bold": False,
            "page": page_data["page"],
            "y0": None,
        }
        
        for char in chars:
            char_font_size = char.get("size", 0)
            char_text = char.get("text", "")
            char_bold = "Bold" in char.get("fontname", "")
            char_y0 = char.get("top", 0)
            
            # Detect block boundaries (font size changes or new lines)
            if current_block["font_size"] is None:
                current_block["font_size"] = char_font_size
                current_block["is_bold"] = char_bold
                current_block["y0"] = char_y0
            
            if (char_font_size != current_block["font_size"] or 
                char_bold != current_block["is_bold"] or
                char_text == "\n"):
                # Save current block if it has content
                if current_block["text"].strip():
                    all_blocks.append(current_block)
                
                # Start new block
                current_block = {
                    "text": char_text if char_text != "\n" else "",
                    "font_size": char_font_size,
                    "is_bold": char_bold,
                    "page": page_data["page"],
                    "y0": char_y0,
                }
            else:
                current_block["text"] += char_text
        
        # Add last block
        if current_block["text"].strip():
            all_blocks.append(current_block)
    
    # Identify headings (larger font, bold, or specific patterns)
    headings = []
    for i, block in enumerate(all_blocks):
        text = block["text"].strip()
        if not text:
            continue
        
        # Heading detection criteria
        is_heading = False
        
        # Large font size (relative to other text)
        font_sizes = [b["font_size"] for b in all_blocks if b["font_size"]]
        if font_sizes:
            avg_font_size = sum(font_sizes) / len(font_sizes)
            if block["font_size"] and block["font_size"] > avg_font_size * 1.2:
                is_heading = True
        
        # Bold text
        if block["is_bold"] and len(text) < 100:
            is_heading = True
        
        # Common heading patterns
        heading_patterns = [
            r"^[A-Z][A-Z\s]+$",  # ALL CAPS
            r"^\d+\.\s+[A-Z]",  # Numbered headings
            r"^[A-Z][a-z]+\s+[A-Z]",  # Title Case
        ]
        import re
        for pattern in heading_patterns:
            if re.match(pattern, text):
                is_heading = True
                break
        
        # Use ML model if available for better detection
        if use_ml:
            try:
                from ml_models import predict_section_heading
                ml_result = predict_section_heading(
                    text,
                    block.get("font_size", 0),
                    block.get("is_bold", False)
                )
                # Use ML prediction if confident, otherwise use pattern-based
                if ml_result.get("confidence", 0) > 0.7:
                    is_heading = ml_result.get("is_heading", is_heading)
            except ImportError:
                pass  # ML models not available, use pattern-based
            except Exception as e:
                print(f"ML prediction error: {e}")
        
        if is_heading:
            headings.append({
                "text": text,
                "level": determine_heading_level(block, headings),
                "page": block["page"],
                "position": i,
                "font_size": block.get("font_size"),
            })
    
    structure["headings"] = headings
    return structure


def determine_heading_level(block: Dict, existing_headings: List[Dict]) -> int:
    """
    Determine heading level based on font size and position.
    
    Args:
        block: Current text block
        existing_headings: List of previously detected headings
        
    Returns:
        Heading level (1 = main section, 2 = subsection, etc.)
    """
    if not existing_headings:
        return 1
    
    # Compare font size with previous headings
    last_heading = existing_headings[-1]
    if block["font_size"] and last_heading.get("font_size"):
        if block["font_size"] > last_heading["font_size"]:
            return max(1, last_heading["level"] - 1)
        elif block["font_size"] < last_heading["font_size"]:
            return last_heading["level"] + 1
    
    return last_heading.get("level", 1)


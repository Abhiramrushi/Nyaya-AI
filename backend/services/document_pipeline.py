import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a PDF document.
    Attempts direct text extraction using PyMuPDF. 
    If a page has very little text (likely scanned), falls back to Tesseract OCR.
    """
    text = ""
    try:
        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text("text")
            
            # Simple heuristic: if text is too short, it might be a scanned image
            if len(page_text.strip()) < 50:
                # Perform OCR
                pix = page.get_pixmap()
                img = Image.open(io.BytesIO(pix.tobytes()))
                page_text = pytesseract.image_to_string(img)
                
            text += f"\n--- Page {page_num + 1} ---\n"
            text += page_text
    except Exception as e:
        print(f"Error processing PDF {file_path}: {e}")
        text = f"Error extracting text: {str(e)}"
        
    return text

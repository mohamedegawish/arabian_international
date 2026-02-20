import sys

def extract_text(pdf_path):
    try:
        import fitz
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except ImportError:
        try:
            import PyPDF2
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except ImportError:
            try:
                import pypdf
                with open(pdf_path, 'rb') as file:
                    reader = pypdf.PdfReader(file)
                    text = ""
                    for page in reader.pages:
                        text += page.extract_text() + "\n"
                    return text
            except ImportError as e:
                return "Error: " + str(e)

if __name__ == "__main__":
    pdf_file = "Arabian International Company Profile _ wing car.pdf"
    content = extract_text(pdf_file)
    with open("pdf_extracted.txt", "w", encoding="utf-8") as f:
        f.write(content)
    print("Extraction done.")

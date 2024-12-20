# certificates.py

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import os

# Register a fallback font that's guaranteed to work with French characters
pdfmetrics.registerFont(TTFont('DejaVuSerif', 'DejaVuSerif.ttf'))

def generate_certificate(student_name, institution, birth_date=None):
    """
    Generate a PDF certificate for a student.
    
    Args:
        student_name (str): Full name of the student
        institution (str): Name of the educational institution
        birth_date (str, optional): Student's birth date
        
    Returns:
        str: Path to the generated certificate file
    """
    # Create output directory if it doesn't exist
    output_dir = "generated_certificates"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{output_dir}/certificate_{student_name.replace(' ', '_')}_{timestamp}.pdf"
    
    # Create the PDF
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4
    
    # Add decorative border
    c.setStrokeColor(colors.navy)
    c.setLineWidth(3)
    c.rect(30, 30, width-60, height-60)
    
    # Add header
    c.setFont('DejaVuSerif', 24)
    c.setFillColor(colors.navy)
    c.drawCentredString(width/2, height-100, "ATTESTATION DE SCOLARITÉ")
    
    # Add institution logo placeholder
    c.rect(width/2-50, height-180, 100, 50)  # Placeholder for logo
    
    # Add institution name
    c.setFont('DejaVuSerif', 16)
    c.drawCentredString(width/2, height-220, institution)
    
    # Add certificate text
    c.setFont('DejaVuSerif', 12)
    current_year = datetime.now().year
    text = f"""
    Ce document certifie que

    {student_name}

    est inscrit(e) en tant qu'étudiant(e) régulier(ère)
    pour l'année académique {current_year-1}-{current_year}
    """
    
    # Add birth date if provided
    if birth_date:
        text += f"\nNé(e) le : {birth_date}"
    
    # Draw multi-line text
    y_position = height-350
    for line in text.split('\n'):
        c.drawCentredString(width/2, y_position, line.strip())
        y_position -= 20
    
    # Add date and signature area
    current_date = datetime.now().strftime("%d/%m/%Y")
    c.drawString(50, 150, f"Fait le {current_date}")
    
    c.drawString(width-200, 150, "Le Directeur")
    c.rect(width-200, 80, 150, 50)  # Signature box
    
    # Add footer
    c.setFont('DejaVuSerif', 8)
    c.drawCentredString(width/2, 40, f"Document généré automatiquement le {current_date}")
    
    # Save the PDF
    c.save()
    
    return filename
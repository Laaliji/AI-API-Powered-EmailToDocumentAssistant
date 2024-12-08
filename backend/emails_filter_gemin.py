import google.generativeai as genai
import os
from gmail_service import fetch_Mails

genai.configure(api_key='AIzaSyDBXGiC9zVgX7GX-i6nMttR98LzP47l9DE')
def filter_emails_with_gemini():
    """
    Use Gemini to filter and process emails, returning JSON
    """
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Analyze these emails and return a JSON-formatted response with detailed student request information.

    Provide a JSON with these exact keys for each request:
    - name
    - student_id
    - school_name
    - department
    - document_type
    - contact_email
    - request_urgency
    - additional_context
    - processing_status


    les document possible est (attestation scolaire,relevé de note,attestation de reussit,etc...)

    If information is missing, use null.

    Example JSON structure:

    {{
        "valid_student_requests": [
            {{
                "name": "Student Name",
                "student_id": "null",
                "school_name": "School Name",
                "department": "Department",
                "document_type": "Document Type",
                "contact_email": "email@example.com",
                "request_urgency": "Normal",
                "additional_context": "Context details",
                "processing_status": "Pending"
            }}
        ],
        "total_requests": 1,
        "timestamp": "2024-06-06T12:00:00Z"
    }}

    Respond ONLY with the JSON, without any additional text or markdown , the json response will be use later to fetch as api

    Emails to process:
    {fetch_Mails()}

    Respond ONLY with the JSON, without any additional text or markdown , the json response will be use later to fetch as api
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error processing emails with Gemini: {str(e)}"
    


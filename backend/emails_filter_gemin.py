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
    Analyze these emails and return a JSON-formatted response with detailed email information.

    if value not available return "" for example subject: ""

    Provide a JSON with these exact keys for each email:
    - id
    - sender
    - subject
    - email
    - preview
    - category
    - isImportant
    - date
    - read // from responded
    - document_type

    Example JSON structure:

    {{
        "emails": [
            {{
                "id" : 1,
                "sender": "Alice Johnson",
                "email : "Alice@gmail.com",
                "subject": "Attestation scolaire",
                "preview": "Here are the latest updates on the project...",
                "category": "Work",
                "isImportant": true,
                "document_type": "attestation scolaire",
                "date": "2024/05/28",
                "read": false,
            }},
            {{
                "id" : 2,
                "sender": "Bob Smith",
                "email : "BobSmith@gmail.com",
                "subject": "Relvie de note",
                "preview": "Would you like to grab lunch tomorrow at...",
                "category": "Personal",
                "isImportant": false,
                "date": "2024/05/21",
                "document_type": "Relvie de note",
                "read": false,
            }}
        ]
    }}

    Respond ONLY with the JSON, without any additional text or markdown.

    Emails to process:
    {fetch_Mails()}

    Respond ONLY with the JSON, without any additional text or markdown.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error processing emails with Gemini: {str(e)}"
    
    


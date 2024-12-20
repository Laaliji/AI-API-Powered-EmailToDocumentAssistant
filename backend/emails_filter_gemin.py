import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

# Configure API key
api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("API key is missing. Please set GENAI_API_KEY in your environment variables.")
genai.configure(api_key=api_key)

def filter_emails_with_gemini(emails):
    """
    Use Gemini to filter and process emails, returning JSON.

    Args:
        emails (list): List of email data to process.

    Returns:
        str: JSON response from Gemini AI.
    """
    if not emails:
        return None  # Return None if no emails to process
    
    model = genai.GenerativeModel('gemini-pro')

    prompt = f"""
    Analyze these emails and return a JSON-formatted response with detailed email information.

    If a value is not available, return "" (e.g., subject: "").

    Provide a JSON with these exact keys for each email:
    - id
    - sender
    - subject
    - email
    - preview
    - category
    - isImportant
    - date
    - read (from responded)
    - document_type

    Example JSON structure:

    {{
        "emails": [
            {{
                "id": "1",
                "sender": "Alice Johnson",
                "email": "Alice@gmail.com",
                "subject": "Attestation scolaire",
                "preview": "Here are the latest updates on the project...",
                "category": "Work",
                "isImportant": true,
                "document_type": "attestation scolaire",
                "date": "2024/05/28",
                "read": false
            }},
            {{
                "id": "2",
                "sender": "Bob Smith",
                "email": "BobSmith@gmail.com",
                "subject": "Relevé de note",
                "preview": "Would you like to grab lunch tomorrow at...",
                "category": "Personal",
                "isImportant": false,
                "document_type": "relevé de note",
                "date": "2024/05/21",
                "read": false
            }}
        ]
    }}

    Respond ONLY with the JSON, without any additional text or markdown.

    Emails to process:
    {emails}

    Respond ONLY with the JSON, without any additional text or markdown.
    """

    try:
        response = model.generate_content(prompt)
        return response.text  # Returning only the text content from the model
    except Exception as e:
        return f"Error processing emails with Gemini: {str(e)}"

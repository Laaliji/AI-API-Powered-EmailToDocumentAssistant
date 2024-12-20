# email_processor.py

from langchain_community.agent_toolkits import GmailToolkit
from langchain_community.tools.gmail.search import GmailSearch
from langchain_community.tools.gmail.utils import build_resource_service, get_gmail_credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import re
from dotenv import load_dotenv
import datetime
import logging
import html
import google.generativeai as genai
import json

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Load environment variables
load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv('GENAI_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def analyze_with_gemini(email_text):
    """
    Use Gemini to extract student information from email text.
    """
    try:
        prompt = f"""
        Analyze this email and extract the following information in JSON format:
        - Student's full name
        - Institution/School name
        - Birth date (if mentioned)
        - Additional information (if relevant)

        Email content:
        {email_text}

        Respond only with a JSON object containing these keys:
        {{"name": "", "institution": "", "birth_date": "", "additional_info": ""}}
        """

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            student_info = json.loads(json_str)
            logging.info(f"Gemini extracted information: {student_info}")
            return student_info
        else:
            logging.error("No JSON found in Gemini response")
            return None

    except Exception as e:
        logging.error(f"Error in Gemini analysis: {e}")
        return None

def clean_text(text):
    """Clean and decode HTML entities from text."""
    text = html.unescape(text)
    text = ' '.join(text.split())
    return text

def is_education_related(subject, body):
    """Check if the email is related to educational certificates."""
    education_keywords = [
        'scolarité', 'scolaire', 'certificat', 'attestation', 
        'étudiant', 'école', 'université', 'diplôme', 'education',
        'student', 'school', 'certificate', 'attestation', 'relevé',
        'notes', 'transcript'
    ]
    
    text = (subject + " " + body).lower()
    is_related = any(keyword in text for keyword in education_keywords)
    logging.info(f"Email education-related check: {is_related} for subject: {subject}")
    return is_related

def mark_email_as_read(email_id):
    """Mark an email as read and add 'Processed' label."""
    try:
        api_resource.users().messages().modify(
            userId="me",
            id=email_id,
            body={'addLabelIds': ['Processed']}
        ).execute()
        logging.info(f"Email marked as processed: {email_id}")
        return True
    except Exception as e:
        logging.error(f"Error marking email as processed: {e}")
        return False

def fetch_and_filter_emails():
    """Fetch last 10 emails and filter education-related ones."""
    logging.info("Starting to fetch and filter emails")
    
    try:
        search = GmailSearch(api_resource=api_resource)
        emails = search('in:inbox')
        logging.info(f"Found {len(emails)} emails in inbox")
        
        filtered_mails = []
        for email in emails[:10]:  # Process last 10 emails
            try:
                message = api_resource.users().messages().get(userId="me", id=email["id"]).execute()
                headers = message["payload"].get("headers", [])
                
                def extract_header(name):
                    return next((header["value"] for header in headers 
                            if header["name"].lower() == name.lower()), "")

                subject = extract_header("Subject")
                body = message["snippet"]
                sender = extract_header("From")
                
                logging.info(f"Processing email - Subject: {subject}, From: {sender}")
                
                if is_education_related(subject, body):
                    mail_data = {
                        "id": email["id"],
                        "sender": sender,
                        "subject": subject,
                        "body": body,
                        "labelIds": message.get("labelIds", [])
                    }
                    filtered_mails.append(mail_data)
                    logging.info(f"Added education-related email to filtered list: {subject}")
            
            except Exception as e:
                logging.error(f"Error processing individual email: {e}")
                continue
        
        logging.info(f"Found {len(filtered_mails)} education-related emails")
        return filtered_mails
    
    except Exception as e:
        logging.error(f"Error in fetch_and_filter_emails: {e}")
        return []

def send_certificate_email(recipient_email, student_info, certificate_path):
    """
    Send the generated certificate to the student via email.
    """
    try:
        message = MIMEMultipart()
        message['to'] = recipient_email
        message['subject'] = "Votre Attestation de Scolarité"

        body = f"""
        Bonjour {student_info['name']},

        Veuillez trouver ci-joint votre attestation de scolarité pour l'année académique en cours.

        Cordialement,
        Service de Scolarité
        {student_info['institution']}

        -------------------

        Hello {student_info['name']},

        Please find attached your school certificate for the current academic year.

        Best regards,
        Student Services
        {student_info['institution']}
        """

        message.attach(MIMEText(body, 'plain'))

        with open(certificate_path, 'rb') as attachment:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            
        encoders.encode_base64(part)
        
        part.add_header(
            'Content-Disposition',
            f'attachment; filename="{os.path.basename(certificate_path)}"'
        )
        
        message.attach(part)

        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
        
        api_resource.users().messages().send(
            userId="me",
            body={'raw': raw_message}
        ).execute()

        logging.info(f"Certificate sent successfully to {recipient_email}")
        return True

    except Exception as e:
        logging.error(f"Error sending email: {e}")
        return False

def process_emails():
    """Main function to process emails and send certificates."""
    logging.info("Starting email processing")
    
    try:
        education_emails = fetch_and_filter_emails()
        logging.info(f"Processing {len(education_emails)} education-related emails")
        
        for email in education_emails:
            try:
                if "Processed" in email.get("labelIds", []):
                    logging.info(f"Skipping already processed email: {email['id']}")
                    continue
                
                logging.info(f"Processing email: {email['id']}")
                
                email_text = clean_text(email['subject'] + "\n" + email['body'])
                student_info = analyze_with_gemini(email_text)
                
                if not student_info or not student_info.get("name") or not student_info.get("institution"):
                    logging.warning(f"Incomplete information for email {email['id']}: {student_info}")
                    continue
                
                try:
                    from certificates import generate_certificate
                    certificate_path = generate_certificate(
                        student_info["name"],
                        student_info["institution"],
                        student_info.get("birth_date")
                    )
                    logging.info(f"Certificate generated: {certificate_path}")
                    
                    if send_certificate_email(email['sender'], student_info, certificate_path):
                        mark_email_as_read(email['id'])
                        logging.info(f"Successfully processed email for {student_info['name']}")
                    
                    if os.path.exists(certificate_path):
                        os.remove(certificate_path)
                        logging.info(f"Cleaned up certificate file: {certificate_path}")
                
                except Exception as e:
                    logging.error(f"Error in certificate generation/sending: {e}")
                    continue
                
            except Exception as e:
                logging.error(f"Error processing individual email: {e}")
                continue
                
    except Exception as e:
        logging.error(f"Error in main process_emails function: {e}")

if __name__ == "__main__":
    try:
        credentials = get_gmail_credentials(
            token_file='token.json',
            scopes=['https://mail.google.com/'],
            client_secrets_file='credentials.json'
        )
        api_resource = build_resource_service(credentials=credentials)
        logging.info("Gmail API credentials loaded successfully")
    except Exception as e:
        logging.error(f"Error setting up Gmail credentials: {e}")
        raise

    logging.info("Starting email processor script")
    process_emails()
    logging.info("Email processor script completed")
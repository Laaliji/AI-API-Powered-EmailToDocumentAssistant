from langchain_community.agent_toolkits import GmailToolkit
from langchain_community.tools.gmail.search import GmailSearch
from langchain_community.tools.gmail.utils import build_resource_service, get_gmail_credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
import base64
import io
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv

load_dotenv()

# Gmail API credentials setup
credentials = get_gmail_credentials(
    token_file='token.json',
    scopes=['https://mail.google.com/'],
    client_secrets_file='credentials.json'
)
api_resource = build_resource_service(credentials=credentials)

def fetch_Mails():
    """
    Fetches the last 5 emails from the inbox using the Gmail API.
    """
    search = GmailSearch(api_resource=api_resource)
    emails = search('in:inbox')

    mails = []
    for email in emails[:5]:  # Fetch only the last 5 emails
        message = api_resource.users().messages().get(userId="me", id=email["id"]).execute()
        headers = message["payload"].get("headers", [])

        def extract_header(name):
            for header in headers:
                if header["name"].lower() == name.lower():
                    return header["value"]
            return ""

        mail_data = {
            "id": email["id"],
            "sender": extract_header("From"),
            "subject": extract_header("Subject"),
            "body": message["snippet"],
            "labelIds": email.get("labelIds", []),  # Store label IDs for processing
        }
        mails.append(mail_data)

    return mails

def send_email_with_attachment(to, subject, body, attachment_filename):
    """
    Sends an email with an attachment.
    """
    try:
        message = MIMEMultipart()
        message['to'] = to
        message['subject'] = subject

        message.attach(MIMEText(body, 'plain'))

        # Read the attachment content
        with open(attachment_filename, 'rb') as attachment:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename="{os.path.basename(attachment_filename)}"')
            message.attach(part)

        # Encode the message to send
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        # Send the email
        api_resource.users().messages().send(userId="me", body={"raw": raw_message}).execute()
    except HttpError as error:
        print(f"An error occurred: {error}")

def create_label(label_name):
    """
    Creates a custom label in Gmail.
    """
    label_body = {
        "label": {
            "name": label_name,
            "labelListVisibility": "labelShow",
            "messageListVisibility": "show"
        }
    }
    try:
        api_resource.users().labels().create(userId="me", body=label_body).execute()
    except HttpError as error:
        # If the error indicates that the label already exists, we can ignore it
        if error.resp.status != 409:
            print(f"Error creating label: {error}")

def mark_email_as_read(email_id):
    """
    Marks an email as processed by adding a custom label.
    """
    try:
        # Replace 'Processed' with your custom label name
        api_resource.users().messages().modify(
            userId="me",
            id=email_id,
            body={"addLabelIds": ["Processed"]}
        ).execute()
    except HttpError as error:
        print(f"An error occurred while marking email as processed: {error}")

# Call this function once to create the label if it doesn't exist
create_label("Processed")

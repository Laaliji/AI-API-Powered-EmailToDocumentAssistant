import base64
from googleapiclient.discovery import build
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from gmail_service import credentials

def send_email_with_attachment(to, subject, body, file_path):
    # Construct the email
    message = MIMEMultipart()
    message['to'] = to
    message['subject'] = subject
    message.attach(MIMEText(body, 'plain'))

    # Attach the file
    with open(file_path, 'rb') as attachment:
        mime_base = MIMEBase('application', 'octet-stream')
        mime_base.set_payload(attachment.read())
        encoders.encode_base64(mime_base)
        mime_base.add_header('Content-Disposition', f'attachment; filename="{file_path}"')
        message.attach(mime_base)

    # Send the email
    service = build('gmail', 'v1', credentials=credentials)
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    send_message = {'raw': raw}
    service.users().messages().send(userId="me", body=send_message).execute()

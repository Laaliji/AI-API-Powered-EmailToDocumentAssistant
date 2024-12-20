from gmail_service import send_email_with_attachment, mark_email_as_read, fetch_Mails
from certificates import generate_certificate
import threading

def process_email(mail):
    """
    Process a single email for certificate requests.
    """
    # Check if the email has already been processed
    if "Processed" in mail.get("labelIds", []):
        print(f"Email from {mail['sender']} has already been processed.")
        return
    
    # Adjust the keyword check for certificate requests
    if "certificate" in mail['subject'].lower() or "attestation" in mail['body'].lower():
        # Implement extraction logic (replace with actual extraction logic)
        student_name = "Extracted Student Name"  # Replace with actual extraction logic
        dob = "Extracted DOB"  # Replace with actual extraction logic
        institution = "Extracted Institution"  # Replace with actual extraction logic
        
        # Generate the certificate
        certificate_file = generate_certificate(student_name, dob, institution)
        
        # Send the email with the certificate attached
        send_email_with_attachment(
            to=mail['sender'],
            subject="Your Certificate of Education",
            body="Please find attached your Certificate of Education.",
            attachment_filename=certificate_file
        )
        
        # Mark the email as processed
        mark_email_as_read(mail['id'])
        print(f"Sent certificate to {mail['sender']} and marked email as processed.")

def process_emails():
    """
    Process fetched emails and respond with certificates where applicable.
    """
    mails = fetch_Mails()
    threads = []
    for mail in mails:
        thread = threading.Thread(target=process_email, args=(mail,))
        thread.start()
        threads.append(thread)

    # Wait for all threads to finish
    for thread in threads:
        thread.join()

def main():
    process_emails()

if __name__ == '__main__':
    main()

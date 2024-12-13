from langchain_community.agent_toolkits import GmailToolkit
from langchain_community.tools.gmail.search import GmailSearch
from langchain_community.tools.gmail.utils import (
    build_resource_service,
    get_gmail_credentials
)
import os
import google.generativeai as genai

genai.configure(api_key='AIzaSyDBXGiC9zVgX7GX-i6nMttR98LzP47l9DE')


credentials = get_gmail_credentials(
    token_file='token.json',
    scopes=['https://mail.google.com/'],
    client_secrets_file='credentials.json'
)

api_resource = build_resource_service(credentials=credentials)



def fetch_Mails():
    search = GmailSearch(api_resource=api_resource)

    emails = search('in:inbox')

    mails = []

    for email in emails:
        mail_data = {
            "id": email["id"],
            "threadId": email["threadId"],
            "snippet": email["snippet"],
        }
        
        # Fetch detailed email data
        message = api_resource.users().messages().get(userId="me", id=email["id"]).execute()
        
        # Extract headers
        headers = message["payload"].get("headers", [])
        for header in headers:
            if header["name"] == "Subject":
                mail_data["subject"] = header["value"]
            if header["name"] == "From":
                mail_data["sender"] = header["value"]
            if header["name"] == "Date":
                mail_data["date"] = header["value"]
            if header["name"] == "To":
                mail_data["to"] = header["value"]
        
        # Check if the email thread contains multiple messages (indicating a response)
        thread = api_resource.users().threads().get(userId="me", id=email["threadId"]).execute()
        mail_data["responded"] = len(thread["messages"]) > 1  # True if thread has more than one message
        
        mails.append(mail_data)
    return mails


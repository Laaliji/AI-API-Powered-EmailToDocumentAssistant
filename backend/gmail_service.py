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

search = GmailSearch(api_resource=api_resource)

emails = search('in:inbox')

mails = []


for email in emails :
    mails.append({
        "id"        : email["id"],
        "threadId"  : email["threadId"],
        "snippet"   : email["snippet"],
        "sender"    : email["sender"]
    })
print(mails)

def fetch_Mails() : 
    return mails



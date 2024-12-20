import google.generativeai as genai
import os
from dotenv import load_dotenv 



# Configure Gemini API
load_dotenv()
api_key = os.getenv("GENAI_API_KEY")
genai.configure(api_key=api_key)

def generate_attestation(student_info):
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""Generate an internship attestation document with the following details:
    - Student Name: {student_info['name']}
    - University: {student_info.get('university', 'N/A')}
    - Internship Period: {student_info.get('dates', 'N/A')}
    - Company: {student_info.get('company', 'N/A')}
    
    Create a professional, formatted document suitable for official use."""

    response = model.generate_content(prompt)
    return response.text

def extract_student_info(email_content):
    # Use Gemini to extract structured info from email
    model = genai.GenerativeModel('gemini-pro')
    
    info_extraction_prompt = f"""Extract structured student information from this email:
    {email_content}
    
    Return a JSON with keys: name, university, dates, company"""
    
    response = model.generate_content(info_extraction_prompt)
    return json.loads(response.text)
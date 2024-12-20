import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class AttestationGenerator:
    def __init__(self):
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        self.model = genai.GenerativeModel('gemini-pro')

    def extract_student_info(self, email_content):
        extraction_prompt = f"""Extract structured student information from this email:
        {email_content}

        Return a JSON with these exact keys:
        - name
        - university
        - department
        - internship_period
        - company
        - supervisor
        """
        
        response = self.model.generate_content(extraction_prompt)
        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            return {}

    def generate_attestation(self, student_info):
        attestation_prompt = f"""Generate a professional internship attestation document using:
        Student Name: {student_info.get('name', 'N/A')}
        University: {student_info.get('university', 'N/A')}
        Department: {student_info.get('department', 'N/A')}
        Company: {student_info.get('company', 'N/A')}
        Internship Period: {student_info.get('internship_period', 'N/A')}
        Supervisor: {student_info.get('supervisor', 'N/A')}

        Create a formal, structured attestation document."""

        response = self.model.generate_content(attestation_prompt)
        return response.text
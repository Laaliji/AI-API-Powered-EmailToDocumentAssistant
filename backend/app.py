from flask import Flask , jsonify
from agents import Agents
from tasks import Tasks
from gmail_service import fetch_Mails
from crewai import Crew
from emails_filter_gemin import filter_emails_with_gemini
import json

app = Flask(__name__)

@app.route('/all_emails',methods=['get'])
def getAllEmails() : 
    ret = filter_emails_with_gemini()

    if ret is None:
        return jsonify({"error": "No email data found"}), 400

    responseNonComplet = ret.replace("```json", "").replace("```", "").replace("\n", "").strip()
    response = json.loads(responseNonComplet)

    return jsonify({"data": response})

if __name__ == '__main__' : 
    app.run(debug=True)
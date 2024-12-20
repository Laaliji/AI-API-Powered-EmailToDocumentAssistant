from flask import Flask , jsonify
from flask_cors import CORS
from agents import Agents
from tasks import Tasks
from gmail_service import fetch_Mails
from crewai import Crew
from emails_filter_gemin import filter_emails_with_gemini
import json
import html

app = Flask(__name__)
CORS(app,origins="*")

@app.route('/all_emails', methods=['get'])
def getAllEmails():
    ret = filter_emails_with_gemini()

    if ret is None:
        return jsonify({"error": "No email data found"}), 400

    # Clean the string
    responseNonComplet = html.unescape(ret.replace("```json", "").replace("```", "").replace("\n", "").strip())
    
    # Debug: Print the processed string
    print("Processed response for JSON loading:", responseNonComplet)

    # Validate if the cleaned response is empty or not valid JSON
    if not responseNonComplet:
        return jsonify({"error": "Empty response received"}), 400

    try:
        response = json.loads(responseNonComplet)
    except json.JSONDecodeError as e:
        return jsonify({"error": f"Failed to decode JSON: {str(e)}"}), 500

    return jsonify({"data": response})





@app.route('/getEmailsFromInbox',methods=['get'])
def getEmailsFromInbox() :
    return jsonify(fetch_Mails())

@app.route('/reply',methods=['get'])
def Reply() : 
    pass

if __name__ == '__main__' : 
    app.run(debug=True, port=5001)
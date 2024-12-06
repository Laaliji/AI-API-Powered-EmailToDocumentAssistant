from flask import Flask , jsonify
from agents import Agents
from tasks import Tasks
from gmail_service import fetch_Mails
from crewai import Crew

import os

# get functions
filter_agent = Agents.email_filter_agents()

emails = fetch_Mails()

filter_tasks  = Tasks.filter_emails_task(filter_agent,emails)

crew = Crew(
    agents=[filter_agent],
    tasks=[filter_tasks]
)

result = crew.kickoff()

app = Flask(__name__)

@app.route('/all_emails',methods=['get'])
def getAllEmails() : 
    return jsonify(result)

if __name__ == '__main__' : 
    app.run(debug=True)
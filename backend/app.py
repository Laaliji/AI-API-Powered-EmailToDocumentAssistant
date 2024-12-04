from flask import Flask, request, jsonify
from flask_cors import CORS
from gemini_service import generate_attestation
from email_parser import extract_student_info

app = Flask(__name__)
CORS(app)

@app.route('/generate-attestation', methods=['POST'])
def generate_attestation_endpoint():
    email_content = request.json.get('email', '')
    
    try:
        # Extract student information
        student_info = extract_student_info(email_content)
        
        # Generate attestation using Gemini
        attestation = generate_attestation(student_info)
        
        return jsonify({
            'success': True,
            'attestation': attestation
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True)
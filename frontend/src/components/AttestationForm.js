import React, { useState } from 'react';
import axios from 'axios';

const AttestationGenerator = () => {
  const [emailContent, setEmailContent] = useState('');
  const [attestation, setAttestation] = useState('');
  const [error, setError] = useState(null);

  const handleGenerateAttestation = async () => {
    try {
      const response = await axios.post('http://localhost:5000/generate-attestation', {
        email: emailContent
      });

      if (response.data.success) {
        setAttestation(response.data.attestation);
        setError(null);
      }
    } catch (err) {
      setError('Failed to generate attestation');
      setAttestation('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Internship Attestation Generator</h1>
      <textarea 
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        placeholder="Paste email content here"
        className="w-full h-40 border p-2 mb-4"
      />
      <button 
        onClick={handleGenerateAttestation}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Attestation
      </button>
      
      {error && <p className="text-red-500">{error}</p>}
      
      {attestation && (
        <div className="mt-4 p-4 border">
          <h2 className="font-bold mb-2">Generated Attestation:</h2>
          <pre>{attestation}</pre>
        </div>
      )}
    </div>
  );
};

export default AttestationGenerator;
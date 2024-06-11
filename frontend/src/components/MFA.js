// src/components/MFA.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/MFA.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const MFA = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totpCode, setTotpCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const navigate = useNavigate()

  const fetchQR = async () => {
    try {
      const res = await axios.get('http://localhost:4444/api/generate-2fa', {
        withCredentials: true, // Correct option for sending cookies
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json'
      }
      }
      
    );
      setQrCodeUrl(res.data.qrCodeUrl);
      setLoading(false);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
      setLoading(false);
    }
  };
  
  const verifyTotp = async () => {
    try {
      const res = await axios.post('http://localhost:4444/api/verify-2fa', {
        totpCode
      }, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json'
      } // Correct option for sending cookies
      });
      setVerificationResult(res.data.message);
      navigate('/');
    } catch (err) {
      setVerificationResult(err.response ? err.response.data.message : err.message);
    }
  };
  

  useEffect(() => {
    fetchQR();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="mfa-container">
      <h2>Set Up Two-Factor Authentication</h2>
      <p>Scan the QR code below with your authenticator app:</p>
      <img src={qrCodeUrl} alt="2FA QR Code" />
      <div>
        <label>
          Enter the code from your authenticator app:
          <input
            type="text"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
          />
        </label>
        <button onClick={verifyTotp}>Verify</button>
      </div>
      {verificationResult && <p>{verificationResult}</p>}
    </div>
  );
};

export default MFA;

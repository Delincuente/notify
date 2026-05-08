import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Loader2, RefreshCw } from 'lucide-react';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const phoneNumber = location.state?.phoneNumber;

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/');
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        phoneNumber,
        code
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { phoneNumber });
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) {
      setError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when all digits are entered
  useEffect(() => {
    if (otp.join('').length === 6) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="logo-wrapper">
          <ShieldCheck size={32} color="white" />
        </div>
        <h1 className="auth-title">Verify OTP</h1>
        <p className="auth-subtitle">We've sent a 6-digit code to +91 {phoneNumber}</p>
      </div>

      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            className="otp-digit"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={loading}
          />
        ))}
      </div>

      {error && <p className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</p>}

      <button onClick={handleVerify} className="btn-primary" disabled={loading || otp.join('').length < 6}>
        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Continue'}
      </button>

      <p className="resend-text">
        Didn't receive the code?{' '}
        {timer > 0 ? (
          <span>Resend in {timer}s</span>
        ) : (
          <span className="resend-link" onClick={handleResend}>
            <RefreshCw size={14} style={{ marginRight: '4px', display: 'inline' }} />
            Resend OTP
          </span>
        )}
      </p>
    </div>
  );
};

export default VerifyOtp;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Phone, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Assuming backend is at http://localhost:5000
      await axios.post('http://localhost:5000/api/auth/send-otp', { phoneNumber });
      navigate('/verify', { state: { phoneNumber } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="logo-wrapper">
          <MessageSquare size={32} color="white" />
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Enter your phone number to receive a WhatsApp OTP</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="input-wrapper">
            <span className="input-icon"><Phone size={18} /></span>
            <input
              type="tel"
              className="input-field"
              placeholder="98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              disabled={loading}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Send OTP <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <p className="resend-text">
        By continuing, you agree to our Terms and Privacy Policy
      </p>
    </div>
  );
};

export default Login;

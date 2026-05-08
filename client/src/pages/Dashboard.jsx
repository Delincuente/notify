import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Phone, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome to Notify</h1>
            <p style={{ color: 'var(--text-muted)' }}>You have successfully authenticated via WhatsApp</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn-primary" 
            style={{ width: 'auto', padding: '0.5rem 1.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            <LogOut size={18} style={{ marginRight: '8px' }} /> Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                <User size={24} />
              </div>
              <h3 style={{ fontSize: '1.125rem' }}>User Profile</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>User ID: {user.id}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <CheckCircle size={14} color="var(--primary)" />
              <span style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Verified Account</span>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: 'var(--accent)' }}>
                <Phone size={24} />
              </div>
              <h3 style={{ fontSize: '1.125rem' }}>Phone Number</h3>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>+{user.countryCode} {user.phoneNumber}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Registered via WhatsApp Cloud API</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

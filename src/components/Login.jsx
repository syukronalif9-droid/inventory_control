import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Simulate API call delay for effect
    setTimeout(() => {
      if (username === 'Inventory' && password === 'Maganghub26') {
        sessionStorage.setItem('isAuthenticated', 'true');
        onLogin(true);
      } else {
        setErrorMsg('Sesi Anda telah habis. Silakan masuk lagi.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src="/ggf-logo.svg" alt="GGF Logo" className="login-logo" />
        
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-layout">
            <div className="form-inputs">
              <div className="input-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  placeholder="sukron.setiawan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <label>
                  <input type="checkbox" name="remember" defaultChecked />
                  Ingat username
                </label>
              </div>

              <button className="btn-login" type="submit" disabled={loading}>
                Masuk
              </button>
            </div>
            
            <div className="form-links">
              <a href="#">Lupa nama pengguna dan kata sandi Anda?</a>
              <p className="cookie-text">
                Kuki harus diaktifkan pada peramban Anda 
                <a href="#" style={{display: 'inline', marginLeft: '4px', color: '#1976d2', fontWeight: 'bold'}} aria-label="Bantuan Kuki">
                  <i className="fas fa-question-circle" style={{ fontSize: '12px' }}></i>
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

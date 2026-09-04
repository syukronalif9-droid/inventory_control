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
        <img src="/kisspng-dairy-farm-pt-great-giant-livestock-food-business-5b2f6026a50078.0577139015298314626759.jpg" alt="Logo Great Giant Foods" className="login-logo" style={{ maxWidth: '350px', height: 'auto' }} />
        
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Kata Sandi</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
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
        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Registration successful! You can now log in.");
      setIsRightPanelActive(false); // switch to login
    }
    setLoading(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setErrorMsg(error.message);
    } else if (data.session) {
      onLogin(data.session);
    }
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <span>Use your email for registration</span>
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMsg && isRightPanelActive && <p className="error-text">{errorMsg}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>Sign in</h1>
            <span>Use your account</span>
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMsg && !isRightPanelActive && <p className="error-text">{errorMsg}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

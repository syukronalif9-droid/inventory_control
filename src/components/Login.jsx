import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Firefly {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.alpha = Math.random();
        this.alphaSpeed = Math.random() * 0.02 + 0.005;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha += this.alphaSpeed;

        if (this.alpha <= 0.1 || this.alpha >= 1) {
          this.alphaSpeed = -this.alphaSpeed;
        }

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 243, 252, ${this.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#38bdf8";
        ctx.fill();
        ctx.restore();
      }
    }

    const fireflies = Array.from({ length: 45 }, () => new Firefly());
    let animationId;

    function animate() {
      ctx.clearRect(0, 0, width, height);
      fireflies.forEach((firefly) => {
        firefly.update();
        firefly.draw();
      });
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
      else if (data.session) onLogin(data.session);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        alert("Registration successful! You can now log in.");
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <canvas id="fireflies" ref={canvasRef}></canvas>

      <div className="login-card">
        <h2>{isLogin ? 'Masuk Akun' : 'Daftar Akun'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Masukkan email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Kata Sandi</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
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
          
          {errorMsg && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '10px' }}>{errorMsg}</p>}
          
          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Daftar')}
          </button>
        </form>

        <div className="divider">
          <span>atau login dengan</span>
        </div>

        <div className="social-login">
          <button className="social-btn" id="google"><i className="fab fa-google"></i></button>
          <button className="social-btn" id="facebook"><i className="fab fa-facebook-f"></i></button>
          <button className="social-btn" id="github"><i className="fab fa-github"></i></button>
        </div>

        <div className="extra">
          {isLogin ? (
            <p>Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>Daftar Sekarang</a></p>
          ) : (
            <p>Sudah punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>Login Sekarang</a></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

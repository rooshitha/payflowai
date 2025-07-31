import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // ⬅ Import CSS

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', {
      email: email,
      password: password
})

      const token = res.data.token;

      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      console.log("Decoded Token: ", decoded);

      if (!decoded.tempPasswordUsed) {
        navigate('/reset-password');
      } else if (decoded.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (decoded.role === 'HR') {
        navigate('/hr-dashboard');
      } else {
        navigate('/manager-dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Dashboard</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
        <div className="password-wrapper">
          <input
            type={showPwd ? 'text' : 'password'}
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
          <span className="toggle" onClick={() => setShowPwd(!showPwd)}>
            {showPwd ? '🙈' : '👁️'}
          </span>
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
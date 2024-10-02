import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../service/authService';
import { Link } from 'react-router-dom';
import Footer from '../../layout/Footer';
import Header from '../../layout/Header';

const Login = () => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = authService.login(username, password);

    if (user) {
      history(`/${user.role.toLowerCase()}`);
    } else {
      setError('Credenciais incorretas. Tente novamente.');
    }
  };

  return (
    <div>
      <Header isLoginPage={true} />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite seu usuário"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Entrar</button>
          <br />
          <Link to="/">Voltar</Link>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

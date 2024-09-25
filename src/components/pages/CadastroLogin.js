import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import authService from '../../service/authService'; // Serviço de autenticação

const CadastroDeLogin = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('proprietario'); // Estado para o papel do usuário
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    let response;

    // Verifica o papel escolhido e chama a função de cadastro correspondente
    if (role === 'proprietario') {
      response = authService.register(login, senha); // Cadastro de proprietário
    } else {
      response = authService.register2(login, senha); // Cadastro de cliente
    }

    if (response.error) {
      setError(response.error);  // Exibe mensagem de erro se o usuário já existir
      setLoading(false);
    } else {
      alert('Usuário cadastrado com sucesso!');
      navigate('/');  // Redireciona para a página inicial ou outra após o cadastro
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Cadastro de Login</h1>
        <p>Cadastre-se com suas credenciais para acessar o sistema.</p>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <div className="login-container">
            <h2>Cadastro de Usuário</h2>

            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login">Login</label>
              <input
                type="text"
                id="login"
                name="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Tipo de Usuário</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)} // Define o papel com base na seleção
                required
              >
                <option value="proprietario">Proprietário</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            {error && <p>Erro: {error}</p>}
          </div>
          
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroDeLogin;

import React, { useEffect, useState } from 'react';
import authService from '../../service/authService'; // Importa o serviço de autenticação
import Header from './Header';
import Footer from './Footer';

const ConsultaLogins = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Obtém a lista de usuários cadastrados
    const userList = authService.getUsers();
    setUsers(userList);
  }, []);

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Consulta de Logins Cadastrados</h1>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Login</th>
              <th>Tipo de Usuário</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4">Nenhum usuário encontrado</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
      </div>
      
      <Footer />
    </div>
    
  );
};

export default ConsultaLogins;

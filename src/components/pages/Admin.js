import React from 'react';
import Header from '../pages/Header';
import Footer from '../pages/Footer';

const Admin = () => {

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Painel do Administrador</h1>
        <p>Bem-vindo ao seu painel. Aqui você pode gerenciar o sistema e visualizar logs de usuários</p>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
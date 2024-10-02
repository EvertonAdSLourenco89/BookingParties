import React from 'react';
import Footer from '../../layout/Footer';
import Header from '../../layout/Header';

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
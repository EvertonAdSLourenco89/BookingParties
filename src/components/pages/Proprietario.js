import React from 'react';
import Header from './Header';
import Footer from './Footer';


const Proprietario = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Booking Parties</h1>
        <p>Bem-vindo ao seu painel. Aqui você pode gerenciar suas reservas e cadastrar sua propriedade.</p>
        <h3>Listas das propriedades cadastradas</h3>
      </div>
      <Footer />
    </div>
  );
};

export default Proprietario;
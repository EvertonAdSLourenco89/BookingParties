import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ListaReservas = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Booking Parties</h1>
        <p>Lista reservas.</p>
      </div>
      <div>
        <form action="/agendar-consulta" method="POST">
          <div className="login-container">
            <h2>Cadastro de Reserva</h2>

            <div className="form-group">
              <label htmlFor="codigoReserva">Código da Reserva</label>
              <input  required/>
            </div>

            <div className="form-group">
              <label htmlFor="codigoPropriedade">Código do Local</label>
              <input required />
            </div>

            {/* Dados pessoais do cliente */}
            <h3>Dados Pessoais</h3>
            <div className="form-group">
              <label htmlFor="nomeCliente">Nome Completo</label>
              <input type="text" id="nomeCliente" name="nomeCliente" required />
            </div>

            <div className="form-group">
              <label htmlFor="emailCliente">Email</label>
              <input type="email" id="emailCliente" name="emailCliente" required />
            </div>

            <div className="form-group">
              <label htmlFor="telefoneCliente">Telefone</label>
              <input type="tel" id="telefoneCliente" name="telefoneCliente" required />
            </div>

            <div className="form-group">
              <label htmlFor="enderecoCliente">Endereço</label>
              <input type="text" id="enderecoCliente" name="enderecoCliente" required />
            </div>

            <div className="form-group">
              <label htmlFor="cpfCliente">CPF</label>
              <input type="text" id="cpfCliente" name="cpfCliente" required />
            </div>

            {/* Dados da reserva */}
            <div className="form-group">
              <label htmlFor="date">Data Disponível</label>
              <input type="date" id="date" name="date" required />
            </div>

            {/* Formas de pagamento */}
            <h3>Status de Pagamento</h3>
            <div className="form-group">
              <label htmlFor="pagamento">Pago</label>
            </div>


            <button type="submit">Reservar</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ListaReservas;
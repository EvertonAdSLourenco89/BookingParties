import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';

const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5984/reservas/_all_docs?include_docs=true', {
          auth: {
            username: 'Admin',
            password: '30115982Aib'
          }
        });
        const docs = response.data.rows.map(row => row.doc);  // Obtenha os documentos
        setReservas(docs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  return (
    <div className="home-container">
      <Header />
      
      <div className="home-content">
        <h1>Aqui estão suas reservas.</h1>
        <div className="login-container">
     <form  className="login-form">
       <div className="form-group">
         
       </div>
       <div className="form-group">
       <ul className="home-container">
          {reservas.map((reservas) => (
              <li key={reservas._id}>
             <h2>Código da reserva: {reservas.codigo_reserva}</h2>
              <p>Código da Local: {reservas.codigo_propriedade}</p>
              <p>Tipo: {reservas.tipo_proprietario}</p>
              <p>Nome Completo: {reservas.nome_completo}</p>
              <p>E-mail: {reservas.email}</p>
              <p>Telefone: {reservas.telefone}</p>
              <p>Endereço: {reservas.endereco}</p>
              <p>CPF: {reservas.cpf}</p>
              <p>Data da Reserva: {reservas.data_disponivel}</p>
              <p>Forma de pagamento: {reservas.forma_pagamento}</p>
              <p>Parcela: {reservas.parcela}</p>
              <ul>
                {reservas.itens && reservas.itens.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <br />
              <button type="submit" className="login-btn">Cancelar</button>
        <br />
            </li>
          ))}
        </ul>
         
       </div>
       
     </form>
     </div>
        
      </div>
      
      <Footer />
    </div>
  );
};

export default ListaReservas;
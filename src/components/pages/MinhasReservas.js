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

  const handleCancelar = async (id, rev) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        await axios.delete(`http://localhost:5984/reservas/${id}`, {
          params: { rev },
          auth: {
            username: 'Admin',
            password: '30115982Aib'
          }
        });
        // Remover a reserva do estado após a exclusão
        setReservas(prevReservas => prevReservas.filter(reserva => reserva._id !== id));
      } catch (err) {
        setError(`Erro ao cancelar a reserva: ${err.message}`);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  return (
    <div className="home-container">
      <Header />
      
      <div className="home-content">
        <h1>Aqui estão suas reservas.</h1>
        <div className="login-container">
          <form className="login-form">
            <div className="form-group">
              <ul className="home-container">
                {reservas.map((reserva) => (
                  <li key={reserva._id}>
                    <h2>Código da reserva: {reserva.codigo_reserva}</h2>
                    <p>Código da Local: {reserva.codigo_propriedade}</p>
                    <p>Tipo: {reserva.tipo_proprietario}</p>
                    <p>Nome Completo: {reserva.nome_completo}</p>
                    <p>E-mail: {reserva.email}</p>
                    <p>Telefone: {reserva.telefone}</p>
                    <p>Endereço: {reserva.endereco}</p>
                    <p>CPF: {reserva.cpf}</p>
                    <p>Data da Reserva: {reserva.data_disponivel}</p>
                    <p>Forma de pagamento: {reserva.forma_pagamento}</p>
                    <p>Parcela: {reserva.parcela}</p>
                    <ul>
                      {reserva.itens && reserva.itens.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <br />
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => handleCancelar(reserva._id, reserva._rev)}
                    >
                      Cancelar reserva
                    </button>
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

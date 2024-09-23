import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';

const ListaReservas = () => {
  const [codigoPropriedade, setCodigoPropriedade] = useState(''); // Estado para o código da propriedade
  const [reservas, setReservas] = useState([]); // Estado para as reservas completas
  const [reservasFiltradas, setReservasFiltradas] = useState([]); // Estado para as reservas filtradas
  const [loading, setLoading] = useState(false); // Estado de loading para buscar
  const [error, setError] = useState(null); // Estado de erro para exibir mensagem

  // Função para buscar todas as reservas
  const buscarReservas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5984/reservas/_all_docs?include_docs=true', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
        }
      });

      const docs = response.data.rows.map(row => row.doc); // Obtém os documentos completos
      setReservas(docs); // Armazena todas as reservas
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  // Função para filtrar as reservas pelo código da propriedade
  const filtrarReservas = () => {
    if (codigoPropriedade === '') {
      setReservasFiltradas(reservas); // Se o campo estiver vazio, mostra todas as reservas
    } else {
      const filtradas = reservas.filter(reserva => reserva.codigo_propriedade === codigoPropriedade);
      setReservasFiltradas(filtradas); // Armazena as reservas filtradas
    }
  };

  // Busca todas as reservas na montagem do componente
  useEffect(() => {
    buscarReservas();
  }, []);

  return (
    <div className="home-container">
      <Header />

      <div className="home-content">
        <h1>Buscar Reservas por Código da Propriedade</h1>
        <div className="login-container">
          <div className="form-group">
            <label htmlFor="codigoPropriedade">Digite o código da propriedade:</label>
            <input
              type="text"
              id="codigoPropriedade"
              value={codigoPropriedade}
              onChange={(e) => setCodigoPropriedade(e.target.value)} // Atualiza o valor digitado
              className="form-control"
            /><br></br>
            <br></br>
            <button type="button"
            className="login-btn"
            onClick={filtrarReservas} disabled={loading}>
              {loading ? 'Filtrando...' : 'Buscar Reservas'}
            </button>
          </div>

          <div className="form-group">
            <ul className="home-container">
              {reservasFiltradas.length > 0 ? (
                reservasFiltradas.map((reserva) => (
                  <li key={reserva._id}>
                    <h2>Código da reserva: {reserva.codigo_reserva}</h2>
                    <p>Código da Propriedade: {reserva.codigo_propriedade}</p>
                    <p>Nome Completo: {reserva.nome_completo}</p>
                    <p>Email: {reserva.email}</p>
                    <p>Telefone: {reserva.telefone}</p>
                    <p>Endereço: {reserva.endereco}</p>
                    <p>Data da Reserva: {reserva.data_disponivel}</p>
                    <p>Forma de pagamento: {reserva.forma_pagamento}</p>
                    <br />
                    <button type="button" className="login-btn">Cancelar</button>
                    <br />
                  </li>
                ))
              ) : (
                <p>Nenhuma reserva encontrada.</p>
              )}
            </ul>
          </div>

          {error && <p>Erro: {error}</p>}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListaReservas;

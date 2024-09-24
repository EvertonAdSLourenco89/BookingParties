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

  // Função para formatar data no formato DD/MM/YYYY
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

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
  
        // Limpar o campo de código da propriedade e exibir todas as reservas
        setCodigoPropriedade('');
        setReservasFiltradas(reservas.filter(reserva => reserva._id !== id));
        
      } catch (err) {
        setError(`Erro ao cancelar a reserva: ${err.message}`);
      }
    }
  };

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
                    <p>Data da Reserva: {formatarData(reserva.data_disponivel)}</p> {/* Aplicando a formatação aqui */}
                    <p>Data da Final : {formatarData(reserva.data_final_da_reserva)}</p>
                    <p>Diarias: {reserva.numero_de_diarias}</p>
                    <p>Valor total: R$ {reserva.total_a_pagar},00</p>
                    <p>Forma de pagamento: {reserva.forma_pagamento}</p>
                    <br />
                    <button type="button" className="cancel-btn"
                      onClick={() => handleCancelar(reserva._id, reserva._rev)}
                    >Cancelar</button>
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

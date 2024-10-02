import React, { useEffect, useState } from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import axios from 'axios';
import '../../../../src/ListaPropriedades.css'; // Importe o arquivo CSS

const ListaReservas = () => {
  const [codigoPropriedade, setCodigoPropriedade] = useState(''); // Estado para o código da propriedade
  const [reservas, setReservas] = useState([]); // Estado para as reservas completas
  const [reservasFiltradas, setReservasFiltradas] = useState([]); // Estado para as reservas filtradas
  const [loading, setLoading] = useState(false); // Estado de loading para buscar
  const [error, setError] = useState(null); // Estado de erro para exibir mensagem

  // Função para formatar data no formato DD/MM/YYYY
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
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

      const docs = response.data.rows.map(row => row.doc);
      setReservas(docs);
      setReservasFiltradas(docs); // Inicialmente, todas as reservas estão filtradas
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  // Função para filtrar as reservas pelo código da propriedade
  const filtrarReservas = () => {
    if (codigoPropriedade === '') {
      setReservasFiltradas(reservas);
    } else {
      const filtradas = reservas.filter(reserva => reserva.codigo_propriedade === codigoPropriedade);
      setReservasFiltradas(filtradas);
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
        setReservasFiltradas(prevReservas => prevReservas.filter(reserva => reserva._id !== id));
      } catch (err) {
        setError(`Erro ao cancelar a reserva: ${err.message}`);
      }
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div>
        <h1>Buscar Reservas por Código da Propriedade</h1>
        <div className="form-group">
          <label htmlFor="codigoPropriedade">Digite o código da propriedade</label>
          <input
            type="text"
            id="codigoPropriedade"
            value={codigoPropriedade}
            onChange={(e) => setCodigoPropriedade(e.target.value)} // Atualiza o valor digitado
            className="form-control"
          /><br /><br />
          <button type="button"
            className="login-btn"
            onClick={filtrarReservas} disabled={loading}>
            {loading ? 'Filtrando...' : 'Buscar Reservas'}
          </button>
        </div>

        <div className="grid-container">
          {loading && <p>Carregando...</p>}
          {error && <p>Erro: {error}</p>}
          {reservasFiltradas.length > 0 ? (
            reservasFiltradas.map((reserva) => (
              <div className="card" key={reserva._id}>
                <div className="card-header">
                  <h2>Código da reserva: {reserva.codigo_reserva}</h2>
                </div>
                <div className="card-body">
               
                  <p><strong>Código da Propriedade:</strong> {reserva.codigo_propriedade}</p>
                  <p><strong>Nome Completo:</strong> {reserva.nome_completo}</p>
                  <p><strong>Email:</strong> {reserva.email}</p>
                  <p><strong>Telefone:</strong> {reserva.telefone}</p>
                  <p><strong>Endereço:</strong> {reserva.endereco}</p>
                  <p><strong>Data da Reserva:</strong> {formatarData(reserva.data_disponivel)}</p>
                  <p><strong>Data Final:</strong> {formatarData(reserva.data_final_da_reserva)}</p>
                  <p><strong>Diárias:</strong> {reserva.numero_de_diarias}</p>
                  <p><strong>Valor Total:</strong> R$ {reserva.total_a_pagar},00</p>
                  <p><strong>Forma de Pagamento:</strong> {reserva.forma_pagamento}</p>
                </div>
                <div >
                  <button type="button" className="cancel-btn"
                    onClick={() => handleCancelar(reserva._id, reserva._rev)}
                  >Cancelar</button>
                </div><br/>
                
              </div>
            ))
          ) : (
            <p>Nenhuma reserva encontrada.</p>
          )}
          
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default ListaReservas;

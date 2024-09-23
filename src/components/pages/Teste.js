import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate


const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para navegação


  // Função para buscar os dados do CouchDB
  const fetchData = async () => {
    setLoading(true); // Inicia o estado de carregamento
    try {
      // Faz a requisição GET para o CouchDB
      const response = await axios.get('http://localhost:5984/reservas/_all_docs?include_docs=true', {
        auth: {
          username: 'Admin', // Nome de usuário do CouchDB
          password: '30115982Aib' // Senha do CouchDB
        }
      });

      // Log para verificar a resposta do CouchDB
      console.log('Resposta do CouchDB:', response.data);

      // Obtém os documentos do banco de dados
      const docs = response.data.rows.map(row => row.doc);
      setReservas(docs); // Define o estado com os dados das propriedades
      setLoading(false); // Finaliza o carregamento
    } catch (err) {
      // Se houver um erro, define o estado de erro e encerra o carregamento
      console.error('Erro ao buscar os dados:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Chama fetchData na inicialização do componente
  useEffect(() => {
    fetchData();
  }, []); // O array vazio significa que essa função será chamada apenas uma vez, ao montar o componente

  // Função para excluir a propriedade
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5984/reservas/${reservas._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
        },
        params: { rev: reservas._rev } // CouchDB exige o _rev para exclusão
      });

      setLoading(false);
      alert('Reserva excluída com sucesso!');
      navigate('/cliente');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };
  

  // Exibe o estado de carregamento
  if (loading) return <p>Carregando...</p>;

  // Exibe o estado de erro
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
  onClick={() => handleDelete(reserva.codigo_reserva)} // Passa o código da reserva atual
  disabled={loading}>
  {loading ? 'Excluindo...' : 'Excluir Reserva'}
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

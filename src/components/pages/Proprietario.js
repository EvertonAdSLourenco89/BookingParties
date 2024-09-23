import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate
import Header from './Header';
import Footer from './Footer';

const ListaPropriedades = () => {
  const [propriedades, setPropriedades] = useState([]); // Estado para armazenar as propriedades
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para controlar os erros
  const navigate = useNavigate(); // Hook para navegação

  // Função para buscar os dados do CouchDB
  const fetchData = async () => {
    setLoading(true); // Inicia o estado de carregamento
    try {
      // Faz a requisição GET para o CouchDB
      const response = await axios.get('http://localhost:5984/propriedades/_all_docs?include_docs=true', {
        auth: {
          username: 'Admin', // Nome de usuário do CouchDB
          password: '30115982Aib' // Senha do CouchDB
        }
      });

      // Log para verificar a resposta do CouchDB
      console.log('Resposta do CouchDB:', response.data);

      // Obtém os documentos do banco de dados
      const docs = response.data.rows.map(row => row.doc);
      setPropriedades(docs); // Define o estado com os dados das propriedades
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

  // Função para redirecionar para a página de gerenciamento de propriedade
  const handleEditClick = (codigo_propriedade) => {
    navigate(`/GerenciarPropriedade/${codigo_propriedade}`, { state: { codigoPropriedade: codigo_propriedade } });
  };
  

  // Exibe o estado de carregamento
  if (loading) return <p>Carregando...</p>;

  // Exibe o estado de erro
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  // Renderiza os dados das propriedades após o carregamento
  return (
    <div className="home-container">
      <Header />
      
      <div className="home-content">
        <h1>Aqui estão suas propriedades.</h1>

        <div className="login-container">
          <form className="login-form">
            <div className="form-group">
              <ul className="home-container">
                {propriedades.map((propriedade) => (
                  <li key={propriedade._id}>
                    <h2>Código do Local: {propriedade.codigo_propriedade}</h2>
                    <p>Tipo: {propriedade.tipo_proprietario}</p>
                    <p>Preço: R$ {propriedade.preco}</p>
                    <p>Data disponível: {propriedade.data_disponivel}</p>
                    <p>Itens disponíveis:</p>

                    {/* Verifica se "itens" é um array e exibe a lista */}
                    {Array.isArray(propriedade.itens) ? (
                      <ul>
                        {propriedade.itens.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{propriedade.itens}</p> // Caso não seja array, exibe como texto
                    )}

                    <br />
                    <button 
                      type="button" 
                      className="login-btn"
                      onClick={() => handleEditClick(propriedade.codigo_propriedade)} // Chama a função de redirecionamento
                    >
                      Editar
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

export default ListaPropriedades;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const ListaPropriedades = () => {
  const [propriedades, setPropriedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lista de imagens disponíveis na pasta public/images
  const imagensDisponiveis = [
    'imagens (1).jpg',
    'imagens (2).jpg',
    'imagens (3).jpg',
    'imagens (4).jpg',
    'imagens (5).jpg',
    'imagens (6).jpg',
    'imagens (7).jpg',
    'imagens (8).jpg',
    'imagens (9).jpg',
    // Adicione mais imagens conforme necessário
  ];

  // Função para buscar propriedades do banco de dados
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5984/propriedades/_all_docs?include_docs=true', {
        auth: {
          username: 'Admin',
          password: '30115982Aib',
        },
      });

      const docs = response.data.rows.map(row => ({
        ...row.doc,
        imagensAleatorias: Array.from({ length: 4 }, () => imagensDisponiveis[Math.floor(Math.random() * imagensDisponiveis.length)]) // Atribui 4 imagens aleatórias
      }));

      setPropriedades(docs);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Função para redirecionar para a página de editar propriedade
  const handleEditClick = (codigo_propriedade) => {
    localStorage.setItem('codigo_propriedade', codigo_propriedade);
    navigate('/GerenciarPropriedade');
  };

  // Função para redirecionar para a página de cadastro de propriedade
  const handleCadastrarPropriedade = () => {
    navigate('/cadastrodepropriedade');
  };

  // Função para deletar propriedade
  const handleDelete = async (propriedade) => {
    try {
      setLoading(true);
      if (!propriedade._id || !propriedade._rev) {
        throw new Error('ID ou REV da propriedade não encontrados');
      }

      await axios.delete(`http://localhost:5984/propriedades/${propriedade._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
        },
        params: { rev: propriedade._rev }
      });

      setPropriedades((prevPropriedades) =>
        prevPropriedades.filter((item) => item._id !== propriedade._id)
      );

      setLoading(false);
      alert('Propriedade excluída com sucesso!');
    } catch (err) {
      setLoading(false);
      setError(`Erro ao excluir a propriedade: ${err.message}`);
    }
  };

  // Função para formatar a data no formato dd/mm/yyyy
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Aqui estão suas propriedades.</h1>
        <div className="login-container">
          <form className="login-form">
            <div className="form-group">
              {propriedades.length === 0 ? (
                <div>
                  <p>Nenhuma propriedade cadastrada.</p>
                  <button
                    type="button"
                    className="login-btn"
                    onClick={handleCadastrarPropriedade}
                  >
                    Cadastrar Propriedade
                  </button>
                </div>
              ) : (
                <ul className="home-container">
                  {propriedades.map((propriedade) => (
                    <li key={propriedade._id}>
                      <h2>Código do Local: {propriedade.codigo_propriedade}</h2>
                      <p>Tipo: {propriedade.tipo_propriedade}</p>
                      <p>Preço: R$ {propriedade.preco}</p>
                      <p>Data Disponível: {formatarData(propriedade.data_disponivel)}</p>
                      <p>Data Limite: {formatarData(propriedade.data_final)}</p>
                      
                      <p>Itens Disponíveis:</p>

                      {Array.isArray(propriedade.itens) ? (
                        <ul>
                          {propriedade.itens.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{propriedade.itens}</p>
                      )}

                      {/* Exibe 4 imagens aleatórias */}
                      <div className="property-image-grid">
                        {propriedade.imagensAleatorias.map((imagem, index) => (
                          <img
                            key={index}
                            src={`/images/${imagem}`}
                            alt={`Imagem ${index + 1} de ${propriedade.tipo_propriedade}`}
                            className="property-image"
                          />
                        ))}
                      </div>

                      <br></br>
                      <button 
                        type="button" 
                        className="login-btn"
                        onClick={() => handleEditClick(propriedade.codigo_propriedade)}
                      >
                        Editar
                      </button><br></br><br></br>
                      <button 
                        type="button"
                        className="cancel-btn"
                        onClick={() => handleDelete(propriedade)} disabled={loading}
                      >
                        {loading ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListaPropriedades;

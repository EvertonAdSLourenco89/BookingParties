import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import '../../../../src/ListaPropriedades.css'; // Importe o arquivo CSS

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
    'imagens (10).jpg',  
    'imagens (11).jpg',  
    'imagens (12).jpg',  
    'imagens (13).jpg',  
    'imagens (14).jpg',  
    'imagens (15).jpg',  
    'imagens (16).jpg',  
    'imagens (17).jpg',  
    'imagens (18).jpg',  
    'imagens (19).jpg',  
    'imagens (20).jpg',  
    'imagens (21).jpg',  
    'imagens (22).jpg',  
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
      <div >
        <h1>Propriedades Cadastradas</h1>
        <button className="btn-cadastrar" onClick={handleCadastrarPropriedade}>
          Cadastrar Nova Propriedade
        </button>
        <div className="grid-container">
          
          {propriedades.map((propriedade) => (
            <div className="card" key={propriedade._id}>
              
              <div className="card-header">
                <h2>Propriedade: {propriedade.codigo_propriedade}</h2>
                
              </div>
              <div className="card-body">
              
                <p><strong>Tipo:</strong> {propriedade.tipo_propriedade}</p>
                <p><strong>Preço:</strong> R$ {propriedade.preco},00</p>
                <p><strong>Data Disponível:</strong> {formatarData(propriedade.data_disponivel)}</p>
                <p><strong>Data Limite:</strong> {formatarData(propriedade.data_final)}</p>
                <p><strong>Itens Disponíveis:</strong></p>
                <ul>
                  {propriedade.itens?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div >
                  {propriedade.imagensAleatorias.map((imagem, index) => (
                    <img
                      key={index}
                      src={`/images/${imagem}`}
                      alt={`Imagem ${index + 1}`}
                      className="image-grid-item"
                    />
                  ))}
                  
                </div>
                <div className="button-container">
                        <button 
                            type="button" 
                            className="login-btn"
                            onClick={() => handleEditClick(propriedade.codigo_propriedade)}
                        >
                            Editar
                        </button>
                        <button 
                            type="button"
                            className="cancel-btn"
                            onClick={() => handleDelete(propriedade)} disabled={loading}
                        >
                            {loading ? 'Excluindo...' : 'Excluir'}
                        </button><br/>
                </div>
                
              </div>
                <br/>
                       
              </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListaPropriedades;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate
import Header from './Header';
import Footer from './Footer';

const ListaPropriedades = () => {
  const [propriedades, setPropriedades] = useState([]); // Estado para armazenar as propriedades
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para controlar os erros
  const [filtros, setFiltros] = useState({ codigo: '', tipo: '', preco: '', data: '' }); // Estado para armazenar os filtros de busca
  const navigate = useNavigate(); // Hook para navegação

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
  ];

  // Função para formatar data no formato yyyy-mm-dd (para comparar com o valor salvo)
  const formatDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  // Função para formatar data de yyyy-mm-dd para dd/mm/yyyy
  const formatDateToDisplay = (dateStr) => {
    if (!dateStr) return ''; // Caso a data não exista, retorna string vazia
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Função para buscar os dados do CouchDB
  const fetchData = async (filters = {}) => {
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
      const docs = response.data.rows.map(row => ({
        ...row.doc,
        imagensAleatorias: Array.from({ length: 4 }, () => imagensDisponiveis[Math.floor(Math.random() * imagensDisponiveis.length)])
      }));

      // Aplica os filtros
      const propriedadesFiltradas = docs.filter((propriedade) => {
        const { codigo, tipo, preco, data } = filters;
        const dataISO = data ? formatDateToISO(data) : '';

        return (
          (!codigo || propriedade.codigo_propriedade.includes(codigo)) &&
          (!tipo || propriedade.tipo_propriedade.includes(tipo)) &&
          (!preco || Number(propriedade.preco) <= Number(preco)) &&
          (!data || propriedade.data_disponivel === dataISO)
        );
      });

      setPropriedades(propriedadesFiltradas);
    } catch (err) {
      console.error('Erro ao buscar os dados:', err);
      setError(err.message);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // Chama fetchData na inicialização do componente
  useEffect(() => {
    fetchData();
  }, []); // O array vazio significa que essa função será chamada apenas uma vez, ao montar o componente

  // Função para lidar com a mudança nos filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  // Função para submeter os filtros e buscar os dados filtrados
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData(filtros); // Chama a função de busca com os filtros preenchidos
  };

  // Função para redirecionar para a página de cadastro de reserva
  const handleReservarClick = (codigo_propriedade) => {
    // Guarda o código da propriedade e navega para a página de cadastro de reserva
    navigate(`/cadastroreserva`, { state: { codigoPropriedade: codigo_propriedade } });
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
        <h1>Locais Disponíveis</h1>

        {/* Formulário de filtros */}
        <form className="home2-container" onSubmit={handleFilterSubmit}>
          <div><br />
            <label htmlFor="codigo">Código do Local</label><br />
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={filtros.codigo}
              onChange={handleFilterChange}
            />
          </div>
          <div><br />
            <label htmlFor="tipo">Tipo de Local<br /></label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              value={filtros.tipo}
              onChange={handleFilterChange}
            />
          </div>
          <div><br />
            <label htmlFor="preco">Preço máximo</label><br />
            <input
              type="number"
              id="preco"
              name="preco"
              value={filtros.preco}
              onChange={handleFilterChange}
            />
          </div>
          <div><br />
            <label htmlFor="data">Data disponível</label><br />
            <input
              type="text"
              id="data"
              name="data"
              placeholder="dd/mm/yyyy"
              value={filtros.data}
              onChange={handleFilterChange}
              pattern="\d{2}/\d{2}/\d{4}" // Validação para dd/mm/yyyy
              title="Formato: dd/mm/yyyy" // Mensagem de erro personalizada
            />
          </div><br />
          <button 
            className='login-btn'
            type="submit">Filtrar</button>
        </form>

        <div className="login-container">
          <ul className="home-container">
            {propriedades.map((propriedade) => (
              <li key={propriedade._id}>
                <h2>Código do Local: {propriedade.codigo_propriedade}</h2>
                <p>Tipo: {propriedade.tipo_propriedade}</p>
                <p>Preço: R$ {propriedade.preco}</p>
                <p>Data disponível: {formatDateToDisplay(propriedade.data_disponivel)}</p> {/* Formata data_disponivel */}
                <p>Data Máxima: {formatDateToDisplay(propriedade.data_final)}</p> {/* Formata data_final */}
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
                <br />
                <div className="property-image-grid">
                  {propriedade.imagensAleatorias.map((imagem, index) => (
                    <img
                      key={index}
                      src={`/images/${imagem}`}
                      alt={`Imagem ${index + 1} de ${propriedade.tipo_propriedade}`}
                      className="property-image"
                    />
                  ))}
                  <button 
                    type="button" 
                    className="login-btn"
                    onClick={() => handleReservarClick(propriedade.codigo_propriedade)} // Chama a função de redirecionamento
                  >
                    Reservar
                  </button>
                  <br />
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default ListaPropriedades;

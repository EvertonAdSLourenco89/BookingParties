import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

const Home = () => {
  const [propriedades, setPropriedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ codigo: '', tipo: '', preco: '', data: '' });
  const navigate = useNavigate();

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

  const formatDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const formatDateToDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const fetchData = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5984/propriedades/_all_docs?include_docs=true', {
        auth: {
          username: 'Admin',
          password: '30115982Aib'
        }
      });

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
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData(filtros);
  };

  const handleLogarClick = (codigo_propriedade) => {
    navigate(`/login`, { state: { codigoPropriedade: codigo_propriedade } });
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="left-text">
          <h1>Booking Parties</h1>
          <div>
            <br /><br /><br /><br />
            <h1>Encontre o lugar perfeito para sua Festa e Evento</h1>
            <h2>Chácaras, áreas de lazer, salões de festas...</h2>
          </div>
        </div>
        <div>
          <br /><br /><br /><br />
          <Link to="/login" className="login2-btn">Anuncie sua propriedade</Link>
          <br />
          <Link to="/login" className="login2-btn">Login</Link>
        </div>
      </div>

      <div className="home-content">
        <h1>Locais Disponíveis</h1>

        <form className="home2-container" onSubmit={handleFilterSubmit}>
          <div><br />
            <label htmlFor="codigo">Código do Local</label>
            <br />
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
              pattern="\d{2}/\d{2}/\d{4}"
              title="Formato: dd/mm/yyyy"
            />
          </div>

          <br />
          <button className='login-btn' type="submit">Filtrar</button>
        </form>

        <h1>Locais adicionados recentemente</h1>
        <div className="login-container">
          <ul className="home-container">
            {propriedades.map((propriedade) => (
              <li key={propriedade._id}>
                <h2>Código do Local: {propriedade.codigo_propriedade}</h2>
                <p>Tipo: {propriedade.tipo_propriedade}</p>
                <p>Preço: R$ {propriedade.preco}</p>
                <p>Data Disponível: {formatDateToDisplay(propriedade.data_disponivel)}</p>
                <p>Data Máxima: {formatDateToDisplay(propriedade.data_final)}</p>
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

                <br />
                <button
                  type="button"
                  className="login-btn"
                  onClick={() => handleLogarClick(propriedade.codigo_propriedade)} // Passa o código da propriedade
                >
                  Logar
                </button>
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;

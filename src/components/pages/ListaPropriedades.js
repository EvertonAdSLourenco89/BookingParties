import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const ListaPropriedades = () => {
  const [propriedades, setPropriedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5984/imovel/_all_docs?include_docs=true', {
          auth: {
            username: 'Admin',
            password: '30115982Aib@'
          }
        });
        const docs = response.data.rows.map(row => row.doc);  // Obtenha os documentos
        setPropriedades(docs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Booking Parties</h1>
        <p>Lista lugares para aluguel.</p>
        <ul>
          {propriedades.map((propriedade) => (
            <li key={propriedade._id}>
              <h2>{propriedade.nome}</h2>
              <p>{propriedade.descricao}</p>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default ListaPropriedades;

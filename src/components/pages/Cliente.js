import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Cliente = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redireciona para a página ListaPropriedades
    navigate('/ListaPropriedades');
  };

  return (
    <div className="home-container">
      <Header />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="login-container">
            <h1>Encontre o lugar perfeito para sua festa ou evento.</h1>

            <div className="form-group">
              <label htmlFor="codigoPropriedade">Código da Propriedade</label>
              <input/>
            </div>

            <div className="form-group">
              <label htmlFor="tipoPropriedade">Tipo de Propriedade</label>
              <select id="tipoPropriedade" name="tipoPropriedade" >
                <option value="chacara">Chácara</option>
                <option value="salao">Salão</option>
                <option value="areaDeLazer">Área de Lazer</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="itensInclusos">Itens Inclusos</label>
              <select id="itensInclusos" name="itensIncluso" >
                <option value="churrasqueira">churrasqueira</option>
                <option value="piscina">piscina</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Data Disponível</label>
              <input type="date" id="date" name="date" />
            </div>

            <button type="submit">Procurar Locais</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Cliente;

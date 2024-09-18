import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const GerenciarPropriedade = () => {

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Booking Parties</h1>
        <p>Aqui você pode editar sua propriedade.</p>
      </div>

      <div>
        <form >
          <div className="login-container">
            <h2>Edição de Propriedade</h2>

            <div className="form-group">
              <label htmlFor="codigoPropriedade">Código da Propriedade</label>
              <input type="text" required/>
            </div>

            <div className="form-group">
              <label htmlFor="tipoPropriedade">Tipo de Propriedade</label>
              <select id="tipoPropriedade" name="tipoPropriedade" required>
                <option value="chacara">Chácara</option>
                <option value="salao">Salão</option>
                <option value="areaDeLazer">Área de Lazer</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="itensInclusos">Itens Inclusos</label>
              <textarea
                id="itensInclusos"
                name="itensInclusos"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="date">Data Disponível</label>
              <input type="date" id="date" name="date" required />
            </div>

            <div className="form-group">
              <label htmlFor="image">Imagens da Propriedade</label>
              <input type="file" id="image" name="image" />
            </div>

            <button type="submit">Cadastrar Propriedade</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default GerenciarPropriedade;


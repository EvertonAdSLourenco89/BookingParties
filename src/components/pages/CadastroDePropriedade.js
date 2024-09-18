import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const CadastroDePropriedade = () => {
  const [codigoPropriedade, setCodigoPropriedade] = useState('');

  // Função para gerar um número aleatório único
  const gerarCodigoUnico = () => {
    const randomPart = Math.floor(Math.random() * 10000); // Número aleatório entre 0 e 9999
    const timestamp = Date.now(); // Timestamp atual
    return `${randomPart}-${timestamp}`; // Combinação do número e do timestamp
  };

  // Gera o código quando o componente for montado
  useEffect(() => {
    const codigo = gerarCodigoUnico();
    setCodigoPropriedade(codigo);
  }, []);

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Booking Parties</h1>
        <p>Aqui você pode cadastrar sua propriedade.</p>
      </div>

      <div>
        <form action="/agendar-consulta" method="POST">
          <div className="login-container">
            <h2>Cadastro de Propriedade</h2>

            <div className="form-group">
              <label htmlFor="codigoPropriedade">Código da Propriedade</label>
              <input
                type="text"
                id="codigoPropriedade"
                name="codigoPropriedade"
                value={codigoPropriedade}
                readOnly
                required
              />
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

export default CadastroDePropriedade;


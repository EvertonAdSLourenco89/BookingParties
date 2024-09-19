import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa o hook para navegação
import Header from './Header';
import Footer from './Footer';

const CadastroDePropriedade = () => {
  const [codigoPropriedade, setCodigoPropriedade] = useState('');
  const [tipoPropriedade, setTipoPropriedade] = useState('');
  const [preco, setPreco] = useState('');
  const [itensInclusos, setItensInclusos] = useState('');
  const [dataDisponivel, setDataDisponivel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate(); // Inicializa o hook para navegação

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Criação do objeto JSON com os dados do formulário
    const propriedadeData = {
      codigoPropriedade,
      preco,
      tipoPropriedade,
      itensInclusos,
      dataDisponivel,
    };

    try {
      setLoading(true);

      // Enviando os dados em formato JSON para o CouchDB
      await axios.post('http://localhost:5984/propriedades', propriedadeData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib')
        }
      });

      setLoading(false);
      alert('Propriedade cadastrada com sucesso!');

      // Redireciona para a tela de proprietários
      navigate('/proprietario');
      
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Booking Parties</h1>
        <p>Aqui você pode cadastrar sua propriedade.</p>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
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
              <select
                id="tipoPropriedade"
                name="tipoPropriedade"
                value={tipoPropriedade}
                onChange={(e) => setTipoPropriedade(e.target.value)}
                required
              >
                <option value="chacara">Chácara</option>
                <option value="salao">Salão</option>
                <option value="areaDeLazer">Área de Lazer</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preco">Preço</label>
              <input
                type="text"
                id="preco"
                name="preco"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="itensInclusos">Itens Inclusos</label>
              <textarea
                id="itensInclusos"
                name="itensInclusos"
                rows="4"
                value={itensInclusos}
                onChange={(e) => setItensInclusos(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="date">Data Disponível</label>
              <input
                type="date"
                id="date"
                name="date"
                value={dataDisponivel}
                onChange={(e) => setDataDisponivel(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Propriedade'}
            </button>
            {error && <p>Erro: {error}</p>}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroDePropriedade;

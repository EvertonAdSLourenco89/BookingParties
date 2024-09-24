import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const CadastroDePropriedade = () => {
  const [codigoPropriedade, setCodigoPropriedade] = useState('');
  const [tipoPropriedade, setTipoPropriedade] = useState('');
  const [preco, setPreco] = useState('');
  const [itensInclusos, setItensInclusos] = useState('');
  const [dataDisponivel, setDataDisponivel] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Função para gerar um número aleatório único
  const gerarCodigoUnico = () => {
    const randomPart = Math.floor(Math.random() * 10000); // Número aleatório entre 0 e 9999
    return `${randomPart}`; // Retorna apenas o número aleatório
  };

  // Gera o código quando o componente for montado
  useEffect(() => {
    const codigo = gerarCodigoUnico();
    setCodigoPropriedade(codigo);
  }, []);

  /*/ Função para salvar o código em um arquivo de texto
  const salvarCodigoEmTxt = (codigo) => {
    const element = document.createElement('a');
    const file = new Blob([`Código da Propriedade: ${codigo}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'codigo_propriedade.txt';
    document.body.appendChild(element); // Adiciona o elemento temporariamente ao DOM
    element.click();
    document.body.removeChild(element); // Remove o elemento após o clique
  };*/

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Transformando os itens inclusos em array
    const itensArray = itensInclusos.split(',').map(item => item.trim());

    // Criando o objeto de propriedade
    const propriedadeData = {
      codigo_propriedade: codigoPropriedade, // Código gerado automaticamente
      tipo_propriedade: tipoPropriedade,
      itens: itensArray,
      data_disponivel: dataDisponivel,
      data_final: dataFinal,
      preco: parseFloat(preco)
    };

    try {
      setLoading(true);

      // Requisição POST para criar um novo documento no CouchDB
      await axios.post('http://localhost:5984/propriedades', propriedadeData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib')
        }
      });

      setLoading(false);
      alert('Propriedade cadastrada com sucesso!');

      // Salvar o código da propriedade em um arquivo de texto
      //salvarCodigoEmTxt(codigoPropriedade);

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
                readOnly // Campo não editável
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
                <option value="chacara">Chacara</option>
                <option value="salao">Salao</option>
                <option value="areaDeLazer">Area de Lazer</option>
                <option value="sala">Sala</option>
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
                placeholder="Ex: Cadeiras, Mesas"
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
                min={new Date().toISOString().split("T")[0]} // Evita datas passadas
                max={dataFinal} // Define a data máxima
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataFinal">Data Final</label>
              <input
                type="date"
                id="dataFinal"
                name="dataFinal"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]} // Evita datas passadas
              />
            </div>

            <button type="submit" 
            className="login-btn"
            disabled={loading}>
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

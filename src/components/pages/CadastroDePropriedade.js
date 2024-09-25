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
  const [imagens, setImagens] = useState([]); // Estado para armazenar várias imagens
  const [imagensPreview, setImagensPreview] = useState([]); // URL das imagens para preview

  const navigate = useNavigate();

  const gerarCodigoUnico = () => {
    const randomPart = Math.floor(Math.random() * 10000);
    return `${randomPart}`;
  };

  useEffect(() => {
    const codigo = gerarCodigoUnico();
    setCodigoPropriedade(codigo);
  }, []);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImagens = [...imagens, ...files]; // Adiciona as novas imagens ao estado
    setImagens(newImagens);

    // Gera pré-visualizações
    const previews = newImagens.map(file => URL.createObjectURL(file));
    setImagensPreview(previews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const itensArray = itensInclusos.split(',').map(item => item.trim());

    const propriedadeData = {
      codigo_propriedade: codigoPropriedade,
      tipo_propriedade: tipoPropriedade,
      itens: itensArray,
      data_disponivel: dataDisponivel,
      data_final: dataFinal,
      preco: parseFloat(preco),
    };

    try {
      setLoading(true);
      await axios.post('http://localhost:5984/propriedades', propriedadeData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib')
        }
      });

      setLoading(false);
      alert('Propriedade cadastrada com sucesso!');
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
                <option value="chacara">Sítio</option>
                <option value="salao">Salão</option>
                <option value="areaDeLazer">Área de Lazer</option>
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
                onChange={(e) => {
                  const valorFormatado = e.target.value.replace(',', '.');
                  setPreco(valorFormatado);
                }}
                placeholder="Ex: 150"
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
                min={new Date().toISOString().split("T")[0]}
                max={dataFinal}
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
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Campo para upload das imagens */}
            <div className="form-group">
              <label htmlFor="imagem">Imagens da Propriedade</label>
              <input
                type="file"
                id="imagem"
                name="imagem"
                accept="image/*"
                onChange={handleImageChange}
                multiple // Permite selecionar várias imagens
              />
            </div>

            {/* Mostrar as imagens de preview se houver */}
            {imagensPreview.length > 0 && (
              <div className="form-group">
                {imagensPreview.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview da Propriedade ${index + 1}`} style={{ width: '300px', height: '200px', margin: '5px' }} />
                ))}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
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

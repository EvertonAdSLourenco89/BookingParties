import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const EditarPropriedade = () => {
  const [codigoPropriedade, setCodigoPropriedade] = useState('');
  const [tipoPropriedade, setTipoPropriedade] = useState('');
  const [preco, setPreco] = useState('');
  const [itensInclusos, setItensInclusos] = useState('');
  const [dataDisponivel, setDataDisponivel] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [propriedade, setPropriedade] = useState(null);
  const [imagens, setImagens] = useState([]); // Altere para um array
  const [imagensPreview, setImagensPreview] = useState([]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImagens = [...imagens, ...files];
    setImagens(newImagens);

    // Gera pré-visualizações
    const previews = newImagens.map(file => URL.createObjectURL(file));
    setImagensPreview(previews);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const codigo = localStorage.getItem('codigo_propriedade');
    if (codigo) {
      setCodigoPropriedade(codigo);
      buscarPropriedade(codigo);
    }
  }, []);

  const buscarPropriedade = async (codigo) => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:5984/propriedades/_find`, {
        selector: { codigo_propriedade: codigo }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
        }
      });

      if (response.data.docs.length > 0) {
        const propriedadeData = response.data.docs[0];
        setPropriedade(propriedadeData);
        setTipoPropriedade(propriedadeData.tipo_proprietario);
        setPreco(propriedadeData.preco);
        setItensInclusos(propriedadeData.itens.join(', '));
        setDataDisponivel(propriedadeData.data_disponivel);
        setDataFinal(propriedadeData.data_final);
      } else {
        alert('Propriedade não encontrada');
        setPropriedade(null);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const itensArray = itensInclusos.split(',').map(item => item.trim());

    const propriedadeDataAtualizada = {
      ...propriedade,
      tipo_proprietario: tipoPropriedade,
      itens: itensArray,
      data_disponivel: dataDisponivel,
      preco: parseFloat(preco),
      data_final: dataFinal,
    };

    try {
      setLoading(true);
      await axios.put(`http://localhost:5984/propriedades/${propriedade._id}`, propriedadeDataAtualizada, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib')
        },
        params: { rev: propriedade._rev }
      });

      setLoading(false);
      alert('Propriedade atualizada com sucesso!');
      navigate('/proprietario');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5984/propriedades/${propriedade._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
        },
        params: { rev: propriedade._rev }
      });

      setLoading(false);
      alert('Propriedade excluída com sucesso!');
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
        <h1>Editar sua propriedade</h1>
        <h1>Código: {codigoPropriedade}</h1>
      </div>

      <div>
        <form onSubmit={handleUpdate}>
          <div className="login-container">
            <h2>Editar Propriedade</h2>

            {propriedade && (
              <>
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
                    type= "Number={0,2}"
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
                  />
                </div>

                {imagensPreview.length > 0 && (
                  <div className="form-group">
                    {imagensPreview.map((preview, index) => (
                      <img key={index} src={preview} alt={`Preview da Propriedade ${index + 1}`} style={{ width: '300px', height: '200px', margin: '5px' }} />
                    ))}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="imagem">Imagens da Propriedade</label>
                  <input
                    type="file"
                    id="imagem"
                    name="imagem"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                  />
                </div>

                <button
                  className="login-btn"
                  type="submit" disabled={loading}>
                  {loading ? 'Atualizando...' : 'Atualizar Propriedade'}
                </button><br></br>
                <br></br>
                <button type="button"
                  className="cancel-btn"
                  onClick={handleDelete} disabled={loading}>
                  {loading ? 'Excluindo...' : 'Excluir Propriedade'}
                </button>

                {error && <p>Erro: {error}</p>}
              </>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditarPropriedade;

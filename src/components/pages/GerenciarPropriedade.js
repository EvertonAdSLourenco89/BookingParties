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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [propriedade, setPropriedade] = useState(null); // Objeto completo da propriedade
  
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera o código da propriedade do localStorage
    const codigo = localStorage.getItem('codigo_propriedade');
    setCodigoPropriedade(codigo);

    if (codigo) {
      // Busca os dados da propriedade automaticamente
      buscarPropriedade(codigo);
    }
  }, []);

  // Função para buscar os dados da propriedade pelo código usando _find
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
        const propriedadeData = response.data.docs[0];  // Propriedade encontrada
        setPropriedade(propriedadeData); // Armazena a propriedade completa
        setTipoPropriedade(propriedadeData.tipo_proprietario);
        setPreco(propriedadeData.preco);
        setItensInclusos(propriedadeData.itens.join(', '));
        setDataDisponivel(propriedadeData.data_disponivel);
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

  // Função para atualizar os dados da propriedade
  const handleUpdate = async (event) => {
    event.preventDefault();

    const itensArray = itensInclusos.split(',').map(item => item.trim());

    const propriedadeDataAtualizada = {
      ...propriedade, // Manteve os dados originais
      tipo_proprietario: tipoPropriedade,
      itens: itensArray,
      data_disponivel: dataDisponivel,
      preco: parseFloat(preco),
    };

    try {
      setLoading(true);
      await axios.put(`http://localhost:5984/propriedades/${propriedade._id}`, propriedadeDataAtualizada, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib')
        },
        params: { rev: propriedade._rev } // CouchDB exige o _rev para atualizações
      });

      setLoading(false);
      alert('Propriedade atualizada com sucesso!');
      navigate('/proprietario');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  // Função para excluir a propriedade
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5984/propriedades/${propriedade._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
        },
        params: { rev: propriedade._rev } // CouchDB exige o _rev para exclusão
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

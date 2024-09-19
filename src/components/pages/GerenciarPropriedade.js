import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const GerenciarPropriedade = () => {
  const [codigoPropriedade, setCodigoPropriedade] = useState('');
  const [dadosPropriedade, setDadosPropriedade] = useState({
    codigo: '',
    tipoPropriedade: '',
    itensInclusos: '',
    dataDisponivel: '',
    image: null
  });

  const [erro, setErro] = useState('');

  // Função para buscar os dados da propriedade
  const buscarPropriedade = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/propriedades/${codigoPropriedade}`);
  
      // Verifique se o status da resposta é OK (200-299)
      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }
  
      // Verifique o tipo de conteúdo retornado
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta não é um JSON válido');
      }
  
      // Converte a resposta para JSON
      const data = await response.json();
      
      setDadosPropriedade({
        codigo: data.codigo,
        tipoPropriedade: data.tipoPropriedade,
        itensInclusos: data.itensInclusos,
        dataDisponivel: data.dataDisponivel,
        image: data.image
      });
    } catch (err) {
      setErro(err.message);
    }
  };
  

  // Atualizar os campos com os dados da propriedade quando for buscado
  useEffect(() => {
    if (dadosPropriedade.codigo) {
      setCodigoPropriedade(dadosPropriedade.codigo);
    }
  }, [dadosPropriedade]);

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Booking Parties</h1>
        <p>Aqui você pode editar sua propriedade.</p>
      </div>

      <div>
        {/* Primeiro formulário: Buscar a propriedade pelo código */}
        <form onSubmit={buscarPropriedade}>
          <div className="login-container">
            <div className="form-group">
              <h2>Código da Propriedade</h2>
              <input
                type="text"
                value={codigoPropriedade}
                onChange={(e) => setCodigoPropriedade(e.target.value)}
                required
              />
            </div>

            <br />
            <button type="submit" className="login-btn">Editar</button>
            <br />
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
          </div>
        </form>

        {/* Segundo formulário: Edição dos dados da propriedade */}
        <form>
          <div className="login-container">
            <h2>Edição de Propriedade</h2>

            <div className="form-group">
              <label htmlFor="codigoPropriedade">Código da Propriedade</label>
              <input
                type="text"
                value={dadosPropriedade.codigo}
                readOnly
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoPropriedade">Tipo de Propriedade</label>
              <select
                id="tipoPropriedade"
                name="tipoPropriedade"
                value={dadosPropriedade.tipoPropriedade}
                onChange={(e) =>
                  setDadosPropriedade({
                    ...dadosPropriedade,
                    tipoPropriedade: e.target.value
                  })
                }
                required
              >
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
                value={dadosPropriedade.itensInclusos}
                onChange={(e) =>
                  setDadosPropriedade({
                    ...dadosPropriedade,
                    itensInclusos: e.target.value
                  })
                }
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="date">Data Disponível</label>
              <input
                type="date"
                id="date"
                name="date"
                value={dadosPropriedade.dataDisponivel}
                onChange={(e) =>
                  setDadosPropriedade({
                    ...dadosPropriedade,
                    dataDisponivel: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Imagens da Propriedade</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={(e) =>
                  setDadosPropriedade({
                    ...dadosPropriedade,
                    image: e.target.files[0]
                  })
                }
              />
            </div>

            <button type="submit">Atualizar Propriedade</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default GerenciarPropriedade;



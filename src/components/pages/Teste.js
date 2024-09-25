import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const CadastroReserva = () => {
  const location = useLocation();
  const { codigoPropriedade: codigoPropriedadeNavegacao } = location.state || {};

  const [codigoReserva, setCodigoReserva] = useState('');
  const [codigoPropriedade, setCodigoPropriedade] = useState(codigoPropriedadeNavegacao || '');
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [enderecoCliente, setEnderecoCliente] = useState('');
  const [cpfCliente, setCpfCliente] = useState('');
  const [dataDisponivel, setDataDisponivel] = useState('');
  const [dataFinalDaReserva, setDataFinalDaReserva] = useState('');
  const [numeroDeDiarias, setNumeroDeDiarias] = useState(0);
  const [precoPorDiaria, setPrecoPorDiaria] = useState(0);
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [loadingPreco, setLoadingPreco] = useState(false);
  const [errorPreco, setErrorPreco] = useState(null);
  const [pagamento, setPagamento] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const gerarCodigoUnico = () => {
    const randomPart = Math.floor(Math.random() * 1000000);
    return `${randomPart}`;
  };

  useEffect(() => {
    const codigo = gerarCodigoUnico();
    setCodigoReserva(codigo);
  }, []);

  useEffect(() => {
    const fetchPreco = async () => {
      if (!codigoPropriedade) {
        setPrecoPorDiaria(0);
        return;
      }

      setLoadingPreco(true);
      setErrorPreco(null);

      try {
        const response = await axios.post(
          'http://localhost:5984/propriedades/_find',
          {
            selector: { codigo_propriedade: codigoPropriedade },
            fields: ['preco'],
            limit: 1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
            },
          }
        );

        if (response.data.docs.length === 0) {
          setErrorPreco('Preço não encontrado para a propriedade selecionada.');
          setPrecoPorDiaria(0);
        } else {
          const preco = response.data.docs[0].preco || 0;
          setPrecoPorDiaria(preco);
        }
      } catch (error) {
        setErrorPreco('Erro ao buscar o preço da propriedade.');
        setPrecoPorDiaria(0);
        console.error(error);
      } finally {
        setLoadingPreco(false);
      }
    };

    fetchPreco();
  }, [codigoPropriedade]);

  useEffect(() => {
    if (dataDisponivel && dataFinalDaReserva) {
      const startDate = new Date(dataDisponivel);
      const endDate = new Date(dataFinalDaReserva);
      const timeDiff = endDate - startDate;
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setNumeroDeDiarias(diffDays);
        setError(null);
      } else {
        setNumeroDeDiarias(0);
        setError('A data final deve ser posterior à data inicial.');
      }
    } else {
      setNumeroDeDiarias(0);
    }
  }, [dataDisponivel, dataFinalDaReserva]);

  useEffect(() => {
    if (precoPorDiaria > 0 && numeroDeDiarias > 0) {
      setTotalAPagar(precoPorDiaria * numeroDeDiarias);
    } else {
      setTotalAPagar(0);
    }
  }, [precoPorDiaria, numeroDeDiarias]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!codigoPropriedade) {
      setError('Código da propriedade é obrigatório.');
      return;
    }

    if (!dataDisponivel) {
      setError('Data disponível é obrigatória.');
      return;
    }

    if (!dataFinalDaReserva) {
      setError('Data final da reserva é obrigatória.');
      return;
    }

    if (numeroDeDiarias <= 0) {
      setError('O número de diárias deve ser pelo menos 1.');
      return;
    }

    if (precoPorDiaria <= 0) {
      setError('Preço por diária inválido.');
      return;
    }

    try {
      setLoading(true);
      const propertyResponse = await axios.post(
        'http://localhost:5984/propriedades/_find',
        {
          selector: { codigo_propriedade: codigoPropriedade },
          limit: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
          },
        }
      );

      if (propertyResponse.data.docs.length === 0) {
        setError('Local não encontrado, escolha um Local cadastrado no Bookin Parties');
        setLoading(false);
        return;
      }

      const propriedade = propertyResponse.data.docs[0];
      const dataFinalStr = propriedade.data_final;

      if (dataFinalStr) {
        const dataFinal = new Date(dataFinalStr);
        const dataSelecionada = new Date(dataDisponivel);

        if (dataSelecionada > dataFinal) {
          setError('Esse dia o local não está disponível, por favor, escolha outra data.');
          setLoading(false);
          return;
        }
      }

      const queryParams = {
        selector: {
          codigo_propriedade: codigoPropriedade,
          data_disponivel: dataDisponivel,
        },
        limit: 1,
      };

      const response = await axios.post(
        'http://localhost:5984/reservas/_find',
        queryParams,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
          },
        }
      );

      if (response.data.docs.length > 0) {
        setError('Esse dia o local não está disponível, por favor, escolha outra data.');
        setLoading(false);
        return;
      }

      const reservaData = {
        codigo_reserva: codigoReserva,
        codigo_propriedade: codigoPropriedade,
        nome_completo: nomeCliente,
        email: emailCliente,
        telefone: telefoneCliente,
        endereco: enderecoCliente,
        cpf: cpfCliente,
        data_disponivel: dataDisponivel,
        data_final_da_reserva: dataFinalDaReserva,
        numero_de_diarias: numeroDeDiarias,
        total_a_pagar: totalAPagar,
        pagamento: pagamento,
        data_hora_reserva: new Date().toISOString(),
      };

      await axios.post('http://localhost:5984/reservas', reservaData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
        },
      });

      setSucesso(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/cliente');
      }, 2000);
    } catch (error) {
      setError('Ocorreu um erro ao fazer a reserva.');
      setLoading(false);
      console.error(error);
    }
  };

  const verificarCodigoPropriedade = async () => {
    if (!codigoPropriedade) {
      setError('Por favor, insira um código de local.');
      return;
    }

    try {
      const propertyResponse = await axios.post(
        'http://localhost:5984/propriedades/_find',
        {
          selector: { codigo_propriedade: codigoPropriedade },
          limit: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
          },
        }
      );

      if (propertyResponse.data.docs.length === 0) {
        setError('Local não encontrado, escolha um Local cadastrado no Bookin Parties');
      } else {
        setError(null);
      }
    } catch (error) {
      setError('Erro ao verificar o código do local.');
      console.error(error);
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Booking Parties</h1>
        <p>Preencha os dados e faça sua reserva.</p>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <div className="login-container">
            <h2>Cadastro de Reserva</h2>

            <div className="form-group">
              <label htmlFor="codigoPropriedade">Código do Local</label>
              <input
                type="text"
                id="codigoPropriedade"
                value={codigoPropriedade}
                onChange={(e) => setCodigoPropriedade(e.target.value)}
                onBlur={verificarCodigoPropriedade}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataDisponivel">Data Inicial</label>
              <input
                type="date"
                id="dataDisponivel"
                value={dataDisponivel}
                onChange={(e) => setDataDisponivel(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataFinalDaReserva">Data Final</label>
              <input
                type="date"
                id="dataFinalDaReserva"
                value={dataFinalDaReserva}
                onChange={(e) => setDataFinalDaReserva(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nomeCliente">Nome Completo</label>
              <input
                type="text"
                id="nomeCliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailCliente">Email</label>
              <input
                type="email"
                id="emailCliente"
                value={emailCliente}
                onChange={(e) => setEmailCliente(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefoneCliente">Telefone</label>
              <input
                type="text"
                id="telefoneCliente"
                value={telefoneCliente}
                onChange={(e) => setTelefoneCliente(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="enderecoCliente">Endereço</label>
              <input
                type="text"
                id="enderecoCliente"
                value={enderecoCliente}
                onChange={(e) => setEnderecoCliente(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpfCliente">CPF</label>
              <input
                type="text"
                id="cpfCliente"
                value={cpfCliente}
                onChange={(e) => setCpfCliente(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pagamento">Forma de Pagamento</label>
              <select
                id="pagamento"
                value={pagamento}
                onChange={(e) => setPagamento(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="cartao">Cartão</option>
                <option value="boleto">Boleto</option>
                <option value="pix">Pix</option>
              </select>
            </div>

            <div className="form-group">
              <p>Preço por diária: R$ {precoPorDiaria.toFixed(2)}</p>
              <p>Número de diárias: {numeroDeDiarias}</p>
              <p>Total a pagar: R$ {totalAPagar.toFixed(2)}</p>
            </div>

            {loading ? <p>Carregando...</p> : <button type="submit">Reservar</button>}

            {error && <p className="error">{error}</p>}
            {errorPreco && <p className="error">{errorPreco}</p>}
            {sucesso && <p className="success">Reserva realizada com sucesso!</p>}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroReserva;

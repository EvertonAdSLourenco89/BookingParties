import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
// Removi a importação de jsPDF, já que não está sendo utilizada no código fornecido.

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

  // **Novos Estados Adicionados**
  const [dataFinalDaReserva, setDataFinalDaReserva] = useState(''); // Estado para a data final
  const [numeroDeDiarias, setNumeroDeDiarias] = useState(0); // Estado para o número de diárias

  const [precoPorDiaria, setPrecoPorDiaria] = useState(0); // Preço por diária
  const [totalAPagar, setTotalAPagar] = useState(0); // Total a pagar
  const [loadingPreco, setLoadingPreco] = useState(false); // Carregamento do preço
  const [errorPreco, setErrorPreco] = useState(null); // Erro ao buscar preço

  const [pagamento, setPagamento] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const navigate = useNavigate();

  // Função para gerar um código único para a reserva
  const gerarCodigoUnico = () => {
    const randomPart = Math.floor(Math.random() * 1000000); // Aumentado para reduzir colisões
    return `${randomPart}`;
  };

  // Gera o código de reserva ao montar o componente
  useEffect(() => {
    const codigo = gerarCodigoUnico();
    setCodigoReserva(codigo);
  }, []);

  // **Novo useEffect para buscar o preço por diária**
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
            fields: ['preco'], // Apenas o campo 'preco' é necessário
            limit: 1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + btoa('Admin:30115982Aib'), // ⚠️ Atenção: Evite expor credenciais no frontend
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

  // **Novo useEffect para calcular o número de diárias**
  useEffect(() => {
    if (dataDisponivel && dataFinalDaReserva) {
      const startDate = new Date(dataDisponivel);
      const endDate = new Date(dataFinalDaReserva);
      const timeDiff = endDate - startDate;
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setNumeroDeDiarias(diffDays);
        setError(null); // Limpa erros relacionados às datas
      } else {
        setNumeroDeDiarias(0);
        setError('A data final deve ser posterior à data inicial.');
      }
    } else {
      setNumeroDeDiarias(0);
    }
  }, [dataDisponivel, dataFinalDaReserva]);

  // **Novo useEffect para calcular o total a pagar**
  useEffect(() => {
    if (precoPorDiaria > 0 && numeroDeDiarias > 0) {
      setTotalAPagar(precoPorDiaria * numeroDeDiarias);
    } else {
      setTotalAPagar(0);
    }
  }, [precoPorDiaria, numeroDeDiarias]);

  // Função que lida com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Limpa mensagens de erro anteriores

    // Validações adicionais
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

      // Verifica se a propriedade existe
      const propertyResponse = await axios.post(
        'http://localhost:5984/propriedades/_find',
        {
          selector: { codigo_propriedade: codigoPropriedade },
          limit: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('Admin:30115982Aib'), // ⚠️ Atenção: Evite expor credenciais no frontend
          },
        }
      );

      if (propertyResponse.data.docs.length === 0) {
        setError('Local não encontrado, escolha um Local cadastrado no Bookin Parties');
        setLoading(false);
        return;
      }

      // Extrai data_final da propriedade
      const propriedade = propertyResponse.data.docs[0];
      const dataFinalStr = propriedade.data_final; // Supondo que o campo seja 'data_final'

      if (dataFinalStr) {
        const dataFinal = new Date(dataFinalStr);
        const dataSelecionada = new Date(dataDisponivel);

        // Verifica se a data selecionada é maior que data_final
        if (dataSelecionada > dataFinal) {
          setError('Esse dia o local não está disponível, por favor, escolha outra data.');
          setLoading(false);
          return;
        }
      }

      // Consulta as reservas existentes com o mesmo codigo_propriedade e data_disponivel
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
        // Já existe uma reserva para esta propriedade e data
        setError('Esse dia o local não está disponível, por favor, escolha outra data.');
        setLoading(false);
        return;
      }

      // Caso não exista, procede com a criação da reserva
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
  // Função para verificar o código da propriedade
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
      setError(null); // Limpa a mensagem de erro se o local for encontrado
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

            {/* Campo Código do Local */}
            <div className="form-group">
              <label htmlFor="codigoPropriedade">Código do Local</label>
              <input
                type="text"
                id="codigoPropriedade"
                name="codigoPropriedade"
                value={codigoPropriedade}
                onChange={(e) => setCodigoPropriedade(e.target.value)}
                onBlur={verificarCodigoPropriedade} // Adicionando o onBlur
                required
                readOnly={!!codigoPropriedadeNavegacao}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            {/* Preço por Diária */}
            <div className="form-group">
              <label>Preço por Diária: {loadingPreco ? 'Carregando...' : `R$ ${precoPorDiaria.toFixed(2)}`}</label>
              
            </div>

            {/* Campo Código da Reserva */}
            <div className="form-group">
              <label htmlFor="codigoReserva">Código da Reserva</label>
              <input
                type="text"
                id="codigoReserva"
                name="codigoReserva"
                value={codigoReserva}
                readOnly
                required
              />
            </div>

            <h3>Dados Pessoais</h3>

            {/* Campo Nome Completo */}
            <div className="form-group">
              <label htmlFor="nomeCliente">Nome Completo</label>
              <input
                type="text"
                id="nomeCliente"
                name="nomeCliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                required
              />
            </div>

            {/* Campo Email */}
            <div className="form-group">
              <label htmlFor="emailCliente">Email</label>
              <input
                type="email"
                id="emailCliente"
                name="emailCliente"
                value={emailCliente}
                onChange={(e) => setEmailCliente(e.target.value)}
                required
              />
            </div>

            {/* Campo Telefone */}
            <div className="form-group">
              <label htmlFor="telefoneCliente">Telefone</label>
              <input
                type="tel"
                id="telefoneCliente"
                name="telefoneCliente"
                value={telefoneCliente}
                onChange={(e) => setTelefoneCliente(e.target.value)}
                required
              />
            </div>

            {/* Campo Endereço */}
            <div className="form-group">
              <label htmlFor="enderecoCliente">Endereço</label>
              <input
                type="text"
                id="enderecoCliente"
                name="enderecoCliente"
                value={enderecoCliente}
                onChange={(e) => setEnderecoCliente(e.target.value)}
                required
              />
            </div>

            {/* Campo CPF */}
            <div className="form-group">
              <label htmlFor="cpfCliente">CPF</label>
              <input
                type="text"
                id="cpfCliente"
                name="cpfCliente"
                value={cpfCliente}
                onChange={(e) => setCpfCliente(e.target.value)}
                required
              />
            </div>

            <h3>Datas da Reserva</h3>

            {/* Campo Data Inicial */}
            <div className="form-group">
              <label htmlFor="dataDisponivel">Data Inicial</label>
              <input
                type="date"
                id="dataDisponivel"
                name="dataDisponivel"
                value={dataDisponivel}
                onChange={(e) => setDataDisponivel(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]} // Evita datas passadas
              />
            </div>

            {/* Campo Data Final da Reserva */}
            <div className="form-group">
              <label htmlFor="dataFinalDaReserva">Data Final da Reserva</label>
              <input
                type="date"
                id="dataFinalDaReserva"
                name="dataFinalDaReserva"
                value={dataFinalDaReserva}
                onChange={(e) => setDataFinalDaReserva(e.target.value)}
                required
                min={dataDisponivel || new Date().toISOString().split('T')[0]} // A data final não pode ser anterior à inicial
              />
            </div>

            <h3>Resumo da Reserva</h3>

             {/* Número de Diárias */}
             <div className="form-group">
            <label>Diária(s): {numeroDeDiarias}</label> 
              
            </div>

            {/* Total a Pagar */}
            <div className="form-group">
              <label>Total a Pagar: R$ {totalAPagar.toFixed(2)}</label>
            </div>

            <h3>Formas de Pagamento</h3>

            {/* Campo Forma de Pagamento */}
            <div className="form-group">
              <label htmlFor="pagamento">Escolha a Forma de Pagamento</label>
              <select
                id="pagamento"
                name="pagamento"
                value={pagamento}
                onChange={(e) => setPagamento(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="cartao-credito">Cartão de Crédito</option>
                <option value="cartao-debito">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="boleto">Boleto Bancário</option>
              </select>
            </div>

            {/* Botão de Envio */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Reservando...' : 'Reservar'}
            </button>

            {/* Mensagem de Erro */}
            {error && (
              <div style={{ color: 'red' }}>
                <p>{error}</p>
                {error === 'Local não encontrado, escolha um Local cadastrado no Bookin Parties' && (
                  <Link to="/cliente">Aqui você pode consultar locais disponíveis para sua festa ou evento.</Link>
                )}
              </div>
            )}

            {/* Mensagem de Sucesso */}
            {sucesso && <p style={{ color: 'green' }}>Reserva feita com sucesso! Redirecionando...</p>}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroReserva;

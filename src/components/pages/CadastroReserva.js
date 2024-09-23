import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const CadastroReserva = () => {
  const [codigoReserva, setCodigoReserva] = useState('');
  const [codigoPropriedade, setCodigoPropriedade] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [enderecoCliente, setEnderecoCliente] = useState('');
  const [cpfCliente, setCpfCliente] = useState('');
  const [dataDisponivel, setDataDisponivel] = useState('');
  const [pagamento, setPagamento] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Função para gerar um número aleatório único
  const gerarCodigoUnico = () => {
    const randomPart = Math.floor(Math.random() * 10000);
    return `${randomPart}`;
  };

  useEffect(() => {
    const codigo = gerarCodigoUnico();
    setCodigoReserva(codigo);
  }, []);

  // Função para salvar o código da reserva em um arquivo de texto
  const salvarCodigoEmTxt = (codigo) => {
    const element = document.createElement('a');
    const file = new Blob([`Código da Reserva: ${codigo}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'codigo_reserva.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reservaData = {
      codigo_reserva: codigoReserva,
      codigo_propriedade: codigoPropriedade,
      cliente: {
        nome: nomeCliente,
        email: emailCliente,
        telefone: telefoneCliente,
        endereco: enderecoCliente,
        cpf: cpfCliente
      },
      data_disponivel: dataDisponivel,
      pagamento: {
        metodo: pagamento,
        parcelas: pagamento === 'cartao-credito' ? parcelas : 'À vista'
      }
    };

    try {
      setLoading(true);
      await axios.post('http://localhost:5984/reservas', reservaData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('Admin:30115982Aib')
        }
      });

      setLoading(false);
      alert('Reserva cadastrada com sucesso!');
      salvarCodigoEmTxt(codigoReserva);

      navigate('/cliente');
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
                name="codigoPropriedade"
                value={codigoPropriedade}
                onChange={(e) => setCodigoPropriedade(e.target.value)}
                required
              />
            </div>

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

            <h3>Formas de Pagamento</h3>
            <div className="form-group">
              <label htmlFor="pagamento">Escolha a Forma de Pagamento</label>
              <select
                id="pagamento"
                name="pagamento"
                value={pagamento}
                onChange={(e) => setPagamento(e.target.value)}
                required
              >
                <option value="cartao-credito">Cartão de Crédito</option>
                <option value="cartao-debito">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="boleto">Boleto Bancário</option>
              </select>
            </div>

            {pagamento === 'cartao-credito' && (
              <div className="form-group">
                <label htmlFor="parcelas">Número de Parcelas</label>
                <select
                  id="parcelas"
                  name="parcelas"
                  value={parcelas}
                  onChange={(e) => setParcelas(e.target.value)}
                >
                  <option value="1">À vista</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">4x</option>
                  <option value="5">5x</option>
                  <option value="6">6x</option>
                </select>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Reservando...' : 'Reservar'}
            </button>
            {error && <p>Erro: {error}</p>}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroReserva;

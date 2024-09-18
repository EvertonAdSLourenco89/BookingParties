import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const CadastroReserva = () => {
  const [codigoReserva, setCodigoReserva] = useState('');

  // Função para gerar um número aleatório único
  const gerarCodigoUnico = () => {
    const randomPart = Math.floor(Math.random() * 10000); // Número aleatório entre 0 e 9999
    const timestamp = Date.now(); // Timestamp atual
    return `${randomPart}-${timestamp}`; // Combinação do número e do timestamp
  };

  // Gera o código quando o componente for montado
  useEffect(() => {
    const codigo = gerarCodigoUnico();
    setCodigoReserva(codigo);
  }, []);

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Booking Parties</h1>
        <p>Preencha os dados e faça sua reserva.</p>
      </div>

      <div>
        <form action="/agendar-consulta" method="POST">
          <div className="login-container">
            <h2>Cadastro de Reserva</h2>

            <div className="form-group">
              <label htmlFor="codigoPropriedade">Código do Local</label>
              <input required />
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

            {/* Dados pessoais do cliente */}
            <h3>Dados Pessoais</h3>
            <div className="form-group">
              <label htmlFor="nomeCliente">Nome Completo</label>
              <input type="text" id="nomeCliente" name="nomeCliente" required />
            </div>

            <div className="form-group">
              <label htmlFor="emailCliente">Email</label>
              <input type="email" id="emailCliente" name="emailCliente" required />
            </div>

            <div className="form-group">
              <label htmlFor="telefoneCliente">Telefone</label>
              <input type="tel" id="telefoneCliente" name="telefoneCliente" required />
            </div>

            <div className="form-group">
              <label htmlFor="enderecoCliente">Endereço</label>
              <input type="text" id="enderecoCliente" name="enderecoCliente" required />
            </div>

            <div className="form-group">
              <label htmlFor="cpfCliente">CPF</label>
              <input type="text" id="cpfCliente" name="cpfCliente" required />
            </div>

            {/* Dados da reserva */}
            <div className="form-group">
              <label htmlFor="date">Data Disponível</label>
              <input type="date" id="date" name="date" required />
            </div>

            {/* Formas de pagamento */}
            <h3>Formas de Pagamento</h3>
            <div className="form-group">
              <label htmlFor="pagamento">Escolha a Forma de Pagamento</label>
              <select id="pagamento" name="pagamento" required>
                <option value="cartao-credito">Cartão de Crédito</option>
                <option value="cartao-debito">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="boleto">Boleto Bancário</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="parcelas">Número de Parcelas (para Cartão)</label>
              <select id="parcelas" name="parcelas">
                <option value="1">À vista</option>
                <option value="2">2x</option>
                <option value="3">3x</option>
                <option value="4">4x</option>
                <option value="5">5x</option>
                <option value="6">6x</option>
              </select>
            </div>

            <button type="submit">Reservar</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroReserva;

import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importa o hook useNavigate e Link
import jsPDF from 'jspdf'; // Importa jsPDF

const ListaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5984/reservas/_all_docs?include_docs=true', {
          auth: {
            username: 'Admin',
            password: '30115982Aib'
          }
        });
        const docs = response.data.rows.map(row => row.doc);  // Obtenha os documentos
        setReservas(docs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const gerarPDF = (reserva) => {
    const doc = new jsPDF();
    const dataHoraAtual = new Date().toLocaleString('pt-BR');

    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.text('Booking Parties - Cancelamento da reserva: ', 10, 10);
    doc.setFontSize(12);
    doc.text(`Data e Hora: ${dataHoraAtual}`, 10, 20);

    // Conteúdo da reserva
    doc.setFontSize(14);
    doc.text(` ${reserva.codigo_reserva}`, 10, 30);
    doc.text(`Nome Completo: ${reserva.nome_completo}`, 10, 40);
    doc.text(`E-mail: ${reserva.email}`, 10, 50);
    doc.text(`Telefone: ${reserva.telefone}`, 10, 60);
    doc.text(`Endereço: ${reserva.endereco}`, 10, 70);
    doc.text(`CPF: ${reserva.cpf}`, 10, 80);
    doc.text(`Data da Reserva: ${new Date(reserva.data_disponivel).toLocaleDateString('pt-BR')}`, 10, 90);
    doc.text(`Data Final: ${new Date(reserva.data_final_da_reserva).toLocaleDateString('pt-BR')}`, 10, 90);
    doc.text(`Diarias: ${reserva.numero_de_diarias}`, 10, 30);
    doc.text(`Total: ${reserva.total_a_pagar}`, 10, 70);
    doc.text(`Forma de Pagamento: ${reserva.pagamento}`, 10, 100);

    // Baixar o PDF
    doc.save(`Booking Parties - cancelamento_reserva_${reserva.codigo_reserva}.pdf`);
  };

  const gerarPDFDadosReserva = (reserva) => {
    const doc = new jsPDF();
    
    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.text('Dados da Reserva', 10, 10);
    
    // Conteúdo da reserva
    doc.setFontSize(14);
    doc.text(`Código da Reserva: ${reserva.codigo_reserva}`, 10, 30);
    doc.text(`Nome Completo: ${reserva.nome_completo}`, 10, 40);
    doc.text(`E-mail: ${reserva.email}`, 10, 50);
    doc.text(`Telefone: ${reserva.telefone}`, 10, 60);
    doc.text(`Endereço: ${reserva.endereco}`, 10, 70);
    doc.text(`CPF: ${reserva.cpf}`, 10, 80);
    doc.text(`Data da Reserva: ${new Date(reserva.data_disponivel).toLocaleDateString('pt-BR')}`, 10, 90);
    doc.text(`Data Final: ${new Date(reserva.data_final_da_reserva).toLocaleDateString('pt-BR')}`, 10, 90);
    doc.text(`Diarias: ${reserva.numero_de_diarias}`, 10, 30);
    doc.text(`Total: ${reserva.total_a_pagar}`, 10, 70);
    doc.text(`Forma de Pagamento: ${reserva.pagamento}`, 10, 100);

    // Baixar o PDF
    doc.save(`Dados_Reserva_${reserva.codigo_reserva}.pdf`);
  };

  const handleCancelar = async (id, rev, reserva) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        await axios.delete(`http://localhost:5984/reservas/${id}`, {
          params: { rev },
          auth: {
            username: 'Admin',
            password: '30115982Aib'
          }
        });
        // Remover a reserva do estado após a exclusão
        setReservas(prevReservas => prevReservas.filter(r => r._id !== id));
        // Gera o PDF após o cancelamento
        gerarPDF(reserva);
      } catch (err) {
        setError(`Erro ao cancelar a reserva: ${err.message}`);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  return (
    <div className="home-container">
      <Header />
      
      <div className="home-content">
        <h1>Aqui estão suas reservas.</h1>
        <div className="login-container">
          <form className="login-form">
            <div className="form-group">
              {reservas.length === 0 ? (
                <div>
                  <p>Não há reservas. Se já sabe o código do local, clique no botão abaixo ou em voltar para consultar locais disponíveis.</p>
                  <button type="button"
                  className='login-btn' 
                  onClick={() => navigate('/cadastroReserva')}>
                    Fazer uma reserva
                  </button>
                  <br />
                  <Link to="/cliente">Voltar</Link>
                </div>
              ) : (
                <ul className="home-container">
                  {reservas.map((reserva) => (
                    <li key={reserva._id}>
                      <h2>Código da reserva: {reserva.codigo_reserva}</h2>
                      <p>Código do Local: {reserva.codigo_propriedade}</p>
                      <p>Nome Completo: {reserva.nome_completo}</p>
                      <p>E-mail: {reserva.email}</p>
                      <p>Telefone: {reserva.telefone}</p>
                      <p>Endereço: {reserva.endereco}</p>
                      <p>CPF: {reserva.cpf}</p>
                      <p>Data da Reserva: {new Date(reserva.data_disponivel).toLocaleDateString('pt-BR')}</p>
                      <p>Data da Final : {new Date(reserva.data_final_da_reserva).toLocaleDateString('pt-BR')}</p>
                      <p>Diarias: {reserva.numero_de_diarias}</p>
                      <p>Valor total: R$ {reserva.total_a_pagar},00</p>
                      <p>Forma de pagamento: {reserva.pagamento}</p>
                      <ul>
                        {reserva.itens && reserva.itens.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                      <br />
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => handleCancelar(reserva._id, reserva._rev, reserva)}
                      >
                        Cancelar reserva
                      </button><br></br><br></br>
                      <button
                        type="button"
                        className="login-btn"
                        onClick={() => gerarPDFDadosReserva(reserva)}
                      >
                        Imprimir Dados
                      </button>
                      <br />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ListaReservas;

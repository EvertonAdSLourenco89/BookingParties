import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importa o hook useNavigate e Link
import jsPDF from 'jspdf'; // Importa jsPDF
import '../../ListaPropriedades.css'; // Importe o arquivo CSS

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
    doc.setFontSize(20);
    doc.text(`Booking Parties - Cancelamento da reserva ${reserva.codigo_reserva}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Data e Hora: ${dataHoraAtual}`, 10, 20);

    // Conteúdo da reserva
    doc.setFontSize(14);
    doc.text(`Código da Reserva: ${reserva.codigo_reserva}/ Código do local: ${reserva.codigo_propriedade}`, 20, 30);
    doc.text(`Nome Completo: ${reserva.nome_completo}`, 10, 40);
    doc.text(`E-mail: ${reserva.email}`, 10, 50);
    doc.text(`Telefone: ${reserva.telefone}`, 10, 60);
    doc.text(`Endereço: ${reserva.endereco}`, 10, 70);
    doc.text(`CPF: ${reserva.cpf}`, 10, 80);
    doc.text(`Data da Reserva: ${new Date(reserva.data_disponivel).toLocaleDateString('pt-BR')}`, 10, 90);
    doc.text(`Data Final: ${new Date(reserva.data_final_da_reserva).toLocaleDateString('pt-BR')}`, 10, 100);
    doc.text(`Diárias: ${reserva.numero_de_diarias}`, 10, 110);
    doc.text(`Total: R$ ${reserva.total_a_pagar},00`, 10, 120);
    doc.text(`Forma de Pagamento: ${reserva.pagamento}`, 10, 130);
    
    // Baixar o PDF
    doc.save(`Booking Parties - Cancelamento da reserva ${reserva.codigo_reserva}.pdf`);
  };

  const gerarPDFDadosReserva = (reserva) => {
    const doc = new jsPDF();
    const dataHoraAtual = new Date().toLocaleString('pt-BR');
    
    // Cabeçalho do PDF
    doc.setFontSize(20);
    doc.text(`Booking Parties - Comprovante da reserva ${reserva.codigo_reserva}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Data e Hora: ${dataHoraAtual}`, 10, 20);
    
    // Conteúdo da reserva
    doc.setFontSize(14);
    doc.text(`Código da Reserva: ${reserva.codigo_reserva} / Código do local: ${reserva.codigo_propriedade}`, 20, 30);
    doc.text(`Nome Completo: ${reserva.nome_completo}`, 10, 40);
    doc.text(`E-mail: ${reserva.email}`, 10, 50);
    doc.text(`Telefone: ${reserva.telefone}`, 10, 60);
    doc.text(`Endereço: ${reserva.endereco}`, 10, 70);
    doc.text(`CPF: ${reserva.cpf}`, 10, 80);
    doc.text(`Data da Reserva: ${new Date(reserva.data_disponivel).toLocaleDateString('pt-BR')}`, 10, 90);
    doc.text(`Data Final: ${new Date(reserva.data_final_da_reserva).toLocaleDateString('pt-BR')}`, 10, 100);
    doc.text(`Diárias: ${reserva.numero_de_diarias}`, 10, 110);
    doc.text(`Total: R$ ${reserva.total_a_pagar},00`, 10, 120);
    doc.text(`Forma de Pagamento: ${reserva.pagamento}`, 10, 130);

    // Baixar o PDF
    doc.save(`Booking Parties - Dados da reserva ${reserva.codigo_reserva}.pdf`);
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
        alert(`A reserva ${reserva.codigo_reserva} foi cancelada com sucesso!`);
      } catch (err) {
        setError(`Erro ao cancelar a reserva: ${err.message}`);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados: {error}</p>;

  return (
    <div className="home-containerprop">
      <Header />
      <div>
        <h1>Aqui estão suas reservas.</h1>
        <div className="grid-container">
          {reservas.length === 0 ? (
              <div className="form-group">
                <p>Não há reservas. Se já sabe o código do local, clique no botão abaixo ou em voltar para consultar locais disponíveis.</p>
                <button type="button" className='login-btn' onClick={() => navigate('/cadastroReserva')}>
                  Fazer uma reserva
                </button>
                <br />
                <Link to="/cliente">Voltar</Link>
              </div>
          ) : (
            reservas.map((reserva) => (
              <div className="card" key={reserva._id}>
                <div className="card-header">
                  <h2>Código da Reserva: {reserva.codigo_reserva}</h2>
                </div>
                <div className="card-body">
                  <p><strong>Código do Local:</strong> {reserva.codigo_propriedade}</p>
                  <p><strong>Nome Completo:</strong> {reserva.nome_completo}</p>
                  <p><strong>E-mail:</strong> {reserva.email}</p>
                  <p><strong>Telefone:</strong> {reserva.telefone}</p>
                  <p><strong>Endereço:</strong> {reserva.endereco}</p>
                  <p><strong>CPF:</strong> {reserva.cpf}</p>
                  <p><strong>Data da Reserva:</strong> {new Date(reserva.data_disponivel).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Data Final:</strong> {new Date(reserva.data_final_da_reserva).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Diárias:</strong> {reserva.numero_de_diarias}</p>
                  <p><strong>Valor total:</strong> R$ {reserva.total_a_pagar},00</p>
                  <p><strong>Forma de pagamento:</strong> {reserva.pagamento}</p>
                  <ul>
                    {reserva.itens && reserva.itens.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="button-container">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => handleCancelar(reserva._id, reserva._rev, reserva)}
                  >
                    Cancelar reserva
                  </button>
                  <button
                    type="button"
                    className="login-btn"
                    onClick={() => gerarPDFDadosReserva(reserva)}
                  >
                    Imprimir Dados
                  </button>
                </div><br></br><br></br><br></br>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListaReservas;

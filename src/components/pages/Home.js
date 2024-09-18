import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../pages/Footer';

const Home = () => {
    return (
        <div className="home-container">
            <header className="home1-header">
                <h1>Booking Parties</h1>
                <p>Consulte e agende os melhores espaços e locais para suas festas e eventos.</p>
            </header>

            <div className="home-content">
                <h2>Acesse sua conta</h2>
                <div className="login-options">
                    <Link to="/login" className="login-btn">Entrar</Link>
                </div>
                <div className="user-info">
                    <p>Usuários Administradores podem gerenciar o sistema e visualizar logs de atividades.</p>
                    <p>Se você é o proprietario você pode cadastrar uma propriedade e gerenciar as reservas.</p>
                    <p>Se você é um cliente, você podera consultar locais, fazer e consultar suas reservas</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
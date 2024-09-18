import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../service/authService';

const Header = () => {
    const navigate = useNavigate();
    const role = authService.getCurrentUser();

    const handleLogout = (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link
        authService.logout(navigate); // Chama o logout e redireciona para a página de login
    };

    return (
        <header className="home-header">
            <div className="system-name">
                <h1>Booking Parties</h1>
                <p>Consulte e agende os melhores espaços e locais para suas festas e eventos.</p>
            </div>
            <nav className="nav-bar">
                <ul className="nav-list">
                    {role === 'admin' && (
                        <>
                            <li><Link to="/admin">Home</Link></li>
                            <li><Link to="/admin/gerenciar">Gerenciar reservas</Link></li>
                            <li><Link to="/admin/logs">Visualizar Logs</Link></li>
                        </>
                    )}
                    {role === 'proprietario' && (
                        <>
                        <li><Link to="/proprietario">Home</Link></li>
                            <li><Link to="/cadastrodepropriedade">Cadastro de Propriedades</Link></li>
                            <li><Link to="/gerenciarpropriedade">Gerenciar Propriedades</Link></li>
                            <li><Link to="/minhasreservas">Gerenciar Reservas</Link></li>
                        </>
                    )}
                    {role === 'cliente' && (
                        <>
                        <li><Link to="/cliente">Home</Link></li>
                            <li><Link to="/minhasreservas">Minhas reservas</Link></li>
                            <li><Link to="/cadastroreserva">Fazer reserva</Link></li>
                        </>
                    )}
                    <li><a href="/login" className="logout-link" onClick={handleLogout}>Sair</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
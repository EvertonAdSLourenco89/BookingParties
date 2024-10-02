import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../service/authService';

const Header = ({ showLinks = true }) => {
    const navigate = useNavigate();
    const role = authService.getCurrentUser();
    const [backgroundImage, setBackgroundImage] = useState('');

    const handleLogout = (e) => {
        e.preventDefault();
        authService.logout(navigate); // Logout do usuário
    };

    useEffect(() => {
        // Lista de imagens disponíveis na pasta public/images
        const images = [
            '/imagens(1).jpg',
            '/imagens(2).jpg',
            // Adicione mais caminhos de imagens conforme necessário
        ];

        // Seleciona uma imagem aleatória
        const randomImage = images[Math.floor(Math.random() * images.length)];
        setBackgroundImage(randomImage);
    }, []);

    return (
        <header 
            className="home-header"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="system-name">
                <h1>Booking Parties</h1>
                <p>Consulte e agende os melhores espaços e locais para suas festas e eventos.</p>
            </div>
            {showLinks ? (
                <nav className="nav-bar">
                    <ul className="nav-list">
                        {role === 'admin' && (
                            <>
                                <li><Link to="/admin">Home</Link></li>
                                <li><Link to="/admin/gerenciar">Gerenciar reservas</Link></li>
                                <li><Link to="/consultaLogins">Visualizar Logins</Link></li>
                            </>
                        )}
                        {role === 'proprietario' && (
                            <>
                                <li><Link to="/proprietario">Home</Link></li>
                                <li><Link to="/cadastrodepropriedade">Cadastro de Propriedades</Link></li>
                                <li><Link to="/reservasProprietario">Gerenciar Reservas</Link></li>
                                <li><Link to="/teste">teste</Link></li>
                            </>
                        )}
                        {role === 'cliente' && (
                            <>
                                <li><Link to="/cliente">Home</Link></li>
                                <li><Link to="/minhasreservas">Minhas reservas</Link></li>
                                <li><Link to="/cadastroreserva">Fazer reserva</Link></li>
                            </>
                        )}
                        <li>
                            <Link to="/home" onClick={handleLogout}>Sair</Link>
                        </li>
                    </ul>
                </nav>
            ) : (
                <nav className="nav-bar">
                    <ul className="nav-list">
                        <li>
                            <Link to="/home">Sair</Link> {/* Redirecionando para a página inicial */}
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;

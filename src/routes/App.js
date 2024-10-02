import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../App.css';
import Home from '../components/Home';
import Teste from '../components/Teste';
import Admin from '../components/pages/Admin/Admin';
import LoginsAdmin from '../components/pages/Admin/LoginsAdmin';
import CadastroReserva from '../components/pages/Cliente/CadastroReserva';
import Cliente from '../components/pages/Cliente/Cliente';
import MinhasReservas from'../components/pages/Cliente/MinhasReservas';
import CadastroDeLogin from '../components/pages/Login/CadastroLogin';
import Login from '../components/pages/Login/Login';
import CadastroDePropriedade from '../components/pages/Proprietario/CadastroDePropriedade';
import GerenciarPropriedade from '../components/pages/Proprietario/GerenciarPropriedade';
import ListaPropriedades from '../components/pages/Proprietario/ListaPropriedades';
import Proprietario from '../components/pages/Proprietario/Proprietario';
import ReservasProprietario from '../components/pages/Proprietario/ReservasProprietario';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/proprietario" element={<Proprietario/>} />
        <Route path="/cadastrodepropriedade" element={<CadastroDePropriedade/>} />
        <Route path="/gerenciarpropriedade" element={<GerenciarPropriedade/>} />
        <Route path="/cliente" element={<Cliente/>} />
        <Route path="/cadastroreserva" element={<CadastroReserva/>} />
        <Route path="/minhasreservas" element={<MinhasReservas/>} />
        <Route path="/listapropriedades" element={<ListaPropriedades/>} />
        <Route path="/cadastroreserva" element={<CadastroReserva/>} />
        <Route path="/teste" element={<Teste/>} />
        <Route path="/reservasProprietario" element={<ReservasProprietario/>} />
        <Route path="/cadastroLogin" element={<CadastroDeLogin/>}/>
        <Route path="/consultaLogins" element={<LoginsAdmin/>}/>
      </Routes>
    </Router>
  );
}

export default App;

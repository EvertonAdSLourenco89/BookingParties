import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Proprietario from './components/pages/Proprietario';
import Admin from './components/pages/Admin';
import Cliente from './components/pages/Cliente';
import CadastroDePropriedade from './components/pages/CadastroDePropriedade';
import GerenciarPropriedade from './components/pages/GerenciarPropriedade';
import CadastroReserva from './components/pages/CadastroReserva';
import MinhasReservas from'./components/pages/MinhasReservas';
import ListaPropriedades from './components/pages/ListaPropriedades';
import ReservasProprietario from './components/pages/ReservasProprietario';
import Teste from './components/pages/Teste'




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
      </Routes>
    </Router>
  );
}

export default App;

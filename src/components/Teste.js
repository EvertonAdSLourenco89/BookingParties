import React, { useEffect, useState } from 'react';
import fileService from '../service/fileService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    const loadedLogs = fileService.getAccessLogs('logs_acessos.txt');
    setLogs(loadedLogs);
    setFilteredLogs(loadedLogs);
  }, []);

  // Formata a data do log para o formato YYYY-MM-DD
  const formatLogDate = (logDate) => {
    const [datePart] = logDate.split(','); 
    const [day, month, year] = datePart.split('/'); 
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; 
  };

  const handleFilterByDate = () => {
    if (filterDate) {
      const filtered = logs.filter(log => {
        const formattedLogDate = formatLogDate(log.date);
        return formattedLogDate === filterDate;
      });
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  };

  const handleFilterByAction = (action) => {
    if (action) {
      const filtered = logs.filter(log => log.action === action);
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  };

  const handleSaveLogs = () => {
    fileService.saveFile('logs_acessos.txt');
  };

  const handleResetFilters = () => {
    setFilteredLogs(logs);
    setFilterDate('');
    setFilterAction('');
  };

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Logs de Acessos</h1>

        <div className="filters">
          <div>
            <label htmlFor="filter-date">Filtrar por Data:</label>
            <input
              type="date"
              id="filter-date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <button onClick={handleFilterByDate}>Filtrar</button>
          </div>

          <div>
            <label>Filtrar por Ação:</label>
            <button onClick={() => handleFilterByAction('LOGIN')}>Login</button>
            <button onClick={() => handleFilterByAction('LOGOUT')}>Logout</button>
            <button onClick={() => handleFilterByAction('')}>Todos</button>
          </div>
        </div>

        <div className="control-buttons">
          <button onClick={handleSaveLogs}>Salvar Logs em Arquivo</button>
        </div>

        <table className="logs-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Tipo de Usuário</th>
              <th>Usuário</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.date}</td>
                <td>{log.userType}</td>
                <td>{log.username}</td>
                <td>{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div><br></br><br></br><br></br><br></br><br></br>
      <Footer />
    </div>
  );
};

export default Logs;

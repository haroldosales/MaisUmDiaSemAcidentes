import { useEffect, useState } from 'react';

function App() {
  const [tips, setTips] = useState([]);
  const [status, setStatus] = useState('Verificando API...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.message);
        return fetch('/api/tips');
      })
      .then((res) => res.json())
      .then((data) => setTips(data.tips))
      .catch(() => setStatus('API indisponível'));
  }, []);

  return (
    <div className="app">
      <h1>Mais Um Dia Sem Acidentes</h1>
      <p>Projeto inicial com backend Node.js e frontend React.</p>
      <div className="card">
        <h2>Status da API</h2>
        <p>{status}</p>
      </div>
      <div className="card">
        <h2>Dicas de segurança</h2>
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

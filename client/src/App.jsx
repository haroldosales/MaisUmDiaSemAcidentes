import { useEffect, useState } from 'react';
import memegrito from './memegrito.jpg';

const initialPeople = ['Dev', 'QA', 'PO', 'Designer', 'TM', 'Gerencia da empresa', 'RH', 'Financeiro', 'Marketing', 'Suporte'];
const initialDays = Array.from({ length: 30 }, (_, index) => ({
  day: index + 1,
  status: 'sem estoura',
  people: [initialPeople[index % initialPeople.length], initialPeople[(index + 1) % initialPeople.length]],
}));

function App() {
  const [tips, setTips] = useState([]);
  const [status, setStatus] = useState('Verificando API...');
  const [frontStatus, setFrontStatus] = useState('Verificando front...');
  const [days, setDays] = useState(initialDays);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

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

    fetch('/api/front')
      .then((res) => res.json())
      .then((data) => setFrontStatus(data.message))
      .catch(() => setFrontStatus('Front não conectado'));
  }, []);

  const safeCount = days.filter((day) => day.status === 'sem estoura').length;
  const incidentCount = days.filter((day) => day.status === 'estourei').length;

  function toggleStatus(dayIndex) {
    setDays((currentDays) =>
      currentDays.map((day, index) => {
        if (index !== dayIndex) return day;

        const nextStatus = day.status === 'sem estoura' ? 'estourei' : 'sem estoura';
        if (nextStatus === 'estourei') {
          setAlertMessage(`Dia ${day.day} estourei!`);
          setAlertOpen(true);
          window.setTimeout(() => {
            setAlertOpen(false);
          }, 2200);
        }

        return {
          ...day,
          status: nextStatus,
        };
      }),
    );
  }

  return (
    <div className="app">
      <h1>Mais Um Dia Sem Acidentes</h1>
      <p>Projeto inicial com backend Node.js e frontend React.</p>

      <div className="card summary-card">
        <div>
          <h2>Contador</h2>
          <p>Dias sem estoura: <strong>{safeCount}</strong></p>
          <p>Dias marcados como estourei: <strong>{incidentCount}</strong></p>
        </div>
      </div>

      <div className="card calendar-card">
        <h2>Calendário de marcações</h2>
        <div className="calendar-grid">
          {days.map((day, index) => (
            <button
              key={day.day}
              className={`calendar-day ${day.status === 'estourei' ? 'danger' : 'safe'}`}
              onClick={() => toggleStatus(index)}
              type="button"
            >
              <div className="day-number">{day.day}</div>
              <div className="day-status">
                {day.status}
                {day.status === 'estourei' ? (
                  <span className="day-icon" aria-label="Bonequinho gritando"><img src={memegrito} alt="Bonequinho gritando" /></span>
                ) : null}
              </div>
              <div className="day-people">{day.people.join(', ')}</div>
            </button>
          ))}
        </div>
        <p className="calendar-note">Clique em um dia para marcar como "estourei" ou voltar para "sem estoura".</p>
      </div>

     <div className="card">
        <h2>Dicas de segurança</h2>
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      {alertOpen && (
        <div className="screen-alert" onClick={() => setAlertOpen(false)}>
          <div className="screen-alert-card">
            <div className="screen-alert-icon"><img src={memegrito} alt="Bonequinho gritando" /></div>
            <div className="screen-alert-text">
              <strong>{alertMessage}</strong>
            </div>
            <div className="screen-alert-hint">Toque para fechar</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

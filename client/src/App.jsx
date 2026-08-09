import { useEffect, useState } from 'react';

const initialPeople = ['Lucas', 'Ana', 'Rafael', 'Carla', 'Marina', 'Gustavo'];
const initialDays = Array.from({ length: 30 }, (_, index) => ({
  day: index + 1,
  status: 'sem estoura',
  people: [initialPeople[index % initialPeople.length], initialPeople[(index + 1) % initialPeople.length]],
}));

function App() {
  const [tips, setTips] = useState([]);
  const [status, setStatus] = useState('Verificando API...');
  const [frontStatus, setFrontStatus] = useState('Verificando front...');
  const [days, setDays] = useState(() => loadStoredDays());
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const currentDayIndex = days.length - 1;

  function advanceDay() {
    setDays((currentDays) => {
      const nextIndex = currentDays.length;
      const previousDay = currentDays[currentDays.length - 1] ?? { status: SAFE_STATUS };

      return [
        ...currentDays,
        {
          day: nextIndex + 1,
          status: SAFE_STATUS,
          people: [
            initialPeople[nextIndex % initialPeople.length],
            initialPeople[(nextIndex + 1) % initialPeople.length],
          ],
        },
      ];
    });
  }

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

  useEffect(() => {
    window.localStorage.setItem('mais-um-dia-status', JSON.stringify(days));
  }, [days]);

  const safeCount = days.filter((day) => day.status === SAFE_STATUS).length;
  const incidentCount = days.filter((day) => day.status === INCIDENT_STATUS).length;

  function toggleStatus(dayIndex) {
    if (dayIndex !== days.length - 1) {
      return;
    }

    setDays((currentDays) =>
      currentDays.map((day, index) => {
        if (index !== dayIndex) return day;

        const nextStatus = day.status === SAFE_STATUS ? INCIDENT_STATUS : SAFE_STATUS;
        if (nextStatus === INCIDENT_STATUS) {
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
              className={`calendar-day ${day.status === INCIDENT_STATUS ? 'danger' : 'safe'} ${index === currentDayIndex ? 'current' : ''}`}
              onClick={() => toggleStatus(index)}
              disabled={index !== days.length - 1}
              type="button"
            >
              <div className="day-number">{day.day}</div>
              <div className="day-status">
                {day.status}
                {day.status === 'estourei' ? (
                  <span className="day-icon" aria-label="Bonequinho gritando">😱</span>
                ) : null}
              </div>
              <div className="day-people">{day.people.join(', ')}</div>
            </button>
          ))}
        </div>
        <p className="calendar-note">Clique em um dia para marcar como "estourei" ou voltar para "sem estoura".</p>
      </div>

      <div className="card">
        <h2>Status da API</h2>
        <p>{status}</p>
      </div>

      <div className="card">
        <h2>Status do Front</h2>
        <p>{frontStatus}</p>
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

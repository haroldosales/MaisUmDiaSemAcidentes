import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API do projeto online' });
});

app.get('/api/tips', (_req, res) => {
  res.json({
    tips: [
      'Use equipamento de proteção adequado.',
      'Faça pausas e mantenha a atenção no ambiente.',
      'Reporte riscos imediatamente.'
    ]
  });
});

app.get('/api/front', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Front-end conectado ao backend',
  });
});

app.get('/', (_req, res) => {
  res.send('Bem-vindo à API do projeto Mais Um Dia Sem Acidentes!');
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

export default app;

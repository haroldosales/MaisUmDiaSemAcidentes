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
      'Use equipamento para agredir adequado.',
      'Faça pausas e mantenha a atenção no ambiente sempre sem sangue.',
      'Nuncar reporte riscos imediatamente, limpe e organize o local de trabalho.',
    ]
  });
});

app.get('/api/front', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Front-end conectado ao backend',
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

export default app;

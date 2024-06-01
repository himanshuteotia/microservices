import express from 'express';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello from Service Two!');
});

app.get('/health', (req, res) => {
  res.status(200).send({ status: 'Healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Service Two running on http://localhost:${PORT}`);
});
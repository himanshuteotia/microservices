import express from 'express';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello from Service Two!');
});

app.listen(PORT, () => {
  console.log(`Service Two running on http://localhost:${PORT}`);
});
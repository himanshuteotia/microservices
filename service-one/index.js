import express from 'express';

const app = express();
const PORT = 4000;

app.get('/', (req, res) => {
  res.send('Hello from Service One!');
});

app.listen(PORT, () => {
  console.log(`Service One running on http://localhost:${PORT}`);
});
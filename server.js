const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/api/spin', (req, res) => {
  const randomValue = Math.floor(Math.random() * 4) + 1;
  console.log('result: ', randomValue)
  res.json({ value: randomValue });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

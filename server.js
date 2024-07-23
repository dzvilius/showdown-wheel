const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/spin', (req, res) => {
  res.json({ POSITION: Math.floor(Math.random() * 4) + 1 });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

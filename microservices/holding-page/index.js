const path = require('path');
const express = require('express');

const app = express();

// app.get('*', (req, res. next) => {
//
//   res.sendFile(path.join(__dirname, 'index.html')
// ));

app.use(express.static(__dirname));

app.use(express.static(
  path.join(__dirname, '..', '..', 'node_modules', 'wgsa_front-end', 'public')
));

console.log(path.join(__dirname, '..', '..', 'node_modules', 'wgsa_front-end', 'public'))



app.listen(8001);

console.log('Holding page server listening on 8001.')

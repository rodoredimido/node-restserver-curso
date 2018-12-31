require('./config/config')


const express = require('express');
const path = require('path')
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/my_database');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// gonfiguracion global de rutas
app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname, '../public')));

console.log(path.resolve(__dirname, '../public'));




mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});
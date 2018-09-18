require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();

/**
 * Middleware
 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// hablitar la carpeta pública
app.use(express.static(path.resolve( __dirname , '../public')))

//COnfiguración global de rutas
app.use(require('./controladores/index'));

mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;
    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});
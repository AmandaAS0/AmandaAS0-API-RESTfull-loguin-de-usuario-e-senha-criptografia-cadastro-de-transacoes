const express = require('express');

const routerTransacoes = require('./routes/transacoes-routes')
const routerUsuario = require('./routes/usuario-routes')

const app = express()

app.use(express.json())

app.use(routerUsuario)
app.use(routerTransacoes)

module.exports = app
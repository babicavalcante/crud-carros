const express = require('express')
const app = express()

app.use(express.json())

// rotas
const carrosRouter = require('./route/carros')
app.use(carrosRouter)


app.listen(3000, () => {
    console.log("Aplicação rodando em http://localhost:3000")
})
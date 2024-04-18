const express = require('express')

const router = express.Router()

let listaCarros = [
    {
        id: 1,
        marca: "Volkswagen",
        modelo: "Gol",
        cor: "Vermelho",
        preco: 299.99
    },
    {
        id: 2,
        marca: "Toyota",
        modelo: "Corolla",
        cor: "Prata",
        preco: 499.99
    }
]

// middlewares de validação
// Validar se o produto existe
function validarCarro(req, res, next) {
    const id = req.params.id
    const carro = listaCarros.find(carro => carro.id == id)
    if (carro) {
        req.carro = carro
        next()
    } else {
        return res.status(404).json({ mensagem: "Carro não encontrado!" })
    }
}

// validar os atributos do corpo
function validarAtributos(req, res, next) {
    const dadosRecebidos = req.body
    if (!dadosRecebidos.modelo || !dadosRecebidos.preco) {
        return res.status(400).json({ mensagem: "Modelo e preço são obrigatórios" })
    } else {
        next()
    }
}


// CREATE -> Cadastro de um produto
router.post('/carros', validarAtributos, (req, res) => {
    const dados = req.body

    const carro = {
        id: Math.round(Math.random() * 1000),
        marca: dados.marca,
        modelo: dados.nome,
        cor: dados.cor,
        preco: dados.preco
    }

    listaCarros.push(carro)

    res.status(201).json(
        {
            mensagem: "Carro cadastrado com sucesso!",
            carro
        }
    )
})


// READ -> Buscar todos os produtos
router.get('/carros', (req, res) => {
    res.status(200).json(listaCarros)
})

// READ -> Busca de produto especifico
router.get('/carros/:id', validarCarro, (req, res) => {
    res.json(req.carro)
})


// UPDATE -> Alterar um produto
router.put('/carros/:id', validarAtributos, validarCarro, (req, res) => {
    const id = req.params.id
    const novosDados = req.body

    const index = listaCarros.findIndex(carro => carro.id == id)
    
    const carro = {
        id: Number(id),
        marca: novosDados.marca,
        modelo: novosDados.modelo,
        cor: novosDados.cor,
        preco: novosDados.preco
    }

    listaCarros[index] = carro

    res.status(200).json(
        {
            mensagem: "Carro alterado com sucesso!",
            carro
        }
    )
})

// DELETE -> Excluir produto
router.delete('/carros/:id', validarCarro, (req, res) => {
    const id = req.params.id
    const index = listaCarros.findIndex(carro => carro.id == id)
    listaCarros.splice(index, 1)
    res.status(200).json({ mensagem: "Carro excluido sucesso!" })
})

// cores determindas
router.get('/carros/cor/:cor', (req, res) => {
    const cor = req.params.cor.toLowerCase(); // Convertendo para minúsculas para evitar problemas de capitalização

    const carrosDaCor = listaCarros.filter(carro => carro.cor.toLowerCase() === cor);

    if (carrosDaCor.length === 0) {
        return res.status(404).json({ mensagem: "Nenhum carro encontrado com a cor especificada." });
    }

    res.status(200).json({ carros: carrosDaCor });
});


// Rota para calcular e retornar o valor total de todos os carros de uma determinada cor
router.get('/carros/cor/:cor/total', (req, res) => {
    const cor = req.params.cor.toLowerCase();

    const carrosDaCor = listaCarros.filter(carro => carro.cor.toLowerCase() === cor);

    if (carrosDaCor.length === 0) {
        return res.status(404).json({ mensagem: "Nenhum carro encontrado com a cor especificada." });
    }

    const valorTotal = carrosDaCor.reduce((total, carro) => total + carro.preco, 0);

    res.status(200).json({ valorTotal });
});


module.exports = router
const pool = require('../config/conexao')

const validacoesTransacao = async (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {
        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: `Todos os campos obrigatórios devem ser informados` })
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

module.exports = validacoesTransacao
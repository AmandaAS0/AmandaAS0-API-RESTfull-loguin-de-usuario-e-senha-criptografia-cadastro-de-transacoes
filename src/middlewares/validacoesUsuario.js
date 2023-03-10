const pool = require('../config/conexao')

const validacoesUsuario = async (req, res, next) => {
    const { nome, email, senha } = req.body

    try {
        if (!nome) {
            return res.status(400).json({ mensagem: "O nome é obrigatório." });
        }

        if (!email) {
            return res.status(400).json({ mensagem: "O email é obrigatório." });
        }

        if (!senha) {
            return res.status(400).json({ mensagem: "A senha é obrigatória." });
        }

        const { rowCount } = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email])

        if (rowCount) {
            return res.status(400).json({ mensagem: "O email informado já está sendo utilizado por outro usuário." });
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

module.exports = validacoesUsuario
const { verify } = require('jsonwebtoken')
const pool = require('../config/conexao')
const senhaJWT = require('../senhaJWT')

const autenticacaoUsuario = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: "Usuario não autenticado" })
    }

    try {
        const token = authorization.split(' ')[1]

        const { id } = await verify(token, senhaJWT)

        const { rows, rowCount } = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id])

        if (rowCount === 0) {
            return res.status(401).json({ mensagem: "Usuario não autenticado" })
        }

        const { senha, ...usuario } = rows[0]

        req.usuario = usuario

        next()
    } catch (error) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }
}

module.exports = autenticacaoUsuario
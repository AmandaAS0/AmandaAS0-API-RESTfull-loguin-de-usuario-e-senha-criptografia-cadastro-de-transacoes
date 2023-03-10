const { hashSync, compare } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const pool = require('../config/conexao')
const senhaJWT = require('../senhaJWT')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const senhaCriptografada = hashSync(senha, 10)

        const query = "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) returning *"

        const { rows } = await pool.query(query, [nome, email, senhaCriptografada])

        const { senha: senhaUsuario, ...usuario } = rows[0]

        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body

    if (!email) {
        return res.status(400).json({ mensagem: "O email é obrigatório." });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "A senha é obrigatória." });
    }

    try {
        const { rows, rowCount } = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email])

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: "Email e/ou senha inválido(s)." });
        }

        const { senha: senhaUsuario, ...usuario } = await rows[0]

        const compareSenha = await compare(senha, senhaUsuario)

        if (!compareSenha) {
            return res.status(400).json({ mensagem: "Email e/ou senha inválido(s)." })
        }

        const token = sign({ id: usuario.id }, senhaJWT, { expiresIn: '8h' })

        return res.status(200).json({ usuario, token })
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const detalharUsuario = async (req, res) => {
    const { id } = req.usuario

    try {
        const { rows } = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id])

        const { senha: senhaUsuario, ...usuario } = rows[0]

        return res.status(200).json(usuario)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const atualizarDadosUsuario = async (req, res) => {
    const { id } = req.usuario
    const { nome, email, senha } = req.body

    try {
        const senhaCriptografada = hashSync(senha, 10)

        const query = "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4"

        await pool.query(query, [nome, email, senhaCriptografada, id])

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    atualizarDadosUsuario
}
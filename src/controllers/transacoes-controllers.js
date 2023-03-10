const pool = require('../config/conexao');
const { queryCategoria, buscarTransacao } = require('../utils/funcoes');

const listarCategorias = async (req, res) => {
    try {
        const query = `SELECT * FROM categorias`

        const { rows } = await pool.query(query)

        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const cadastrarTransacoes = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const { id } = req.usuario

    try {
        const query = `INSERT INTO transacoes 
        (usuario_id, descricao, valor, data, categoria_id, tipo)
        VALUES ($1, $2, $3, $4, $5, $6) returning *`

        const { rows } = await pool.query(query, [id, descricao, valor, data, categoria_id, tipo])

        const categoria = await queryCategoria(categoria_id)

        const transacao = {
            id: rows[0].id,
            tipo: rows[0].tipo,
            descricao: rows[0].descricao,
            valor: rows[0].valor,
            data: rows[0].data,
            usuario_id: rows[0].usuario_id,
            categoria_id: rows[0].categoria_id,
            categoria_nome: categoria.rows[0].categoria_nome
        }

        return res.status(201).json(transacao)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const detalharTransacao = async (req, res) => {
    const { id } = req.params

    try {
        const query = `SELECT t.id AS id, t.tipo AS tipo, t.descricao AS descricao,
        t.valor AS valor, t.data AS data, t.categoria_id AS categoria_id,
        t.usuario_id AS usuario_id, c.id AS categoria_id ,c.descricao AS categoria_nome 
        FROM transacoes t LEFT JOIN categorias c
        ON t.categoria_id = c.id WHERE t.id = $1 AND t.usuario_id = $2;
        `

        const { rows, rowCount } = await pool.query(query, [id, req.usuario.id])

        if (!rowCount) {
            return res.status(404).json({ mensagem: "Transação não encontrada." })
        }

        const { ...transacao } = rows[0]

        return res.status(200).json(transacao)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const listarTransacoes = async (req, res) => {
    const { filtro } = req.query
    const idUsuario = req.usuario.id

    try {
        const query = `SELECT t.*, c.descricao AS categoria_nome FROM 
        transacoes t JOIN categorias c ON c.id = t.categoria_id 
        WHERE t.usuario_id = $1 AND c.descricao = $2`

        const { rows, rowCount } = await pool.query(query, [idUsuario, filtro])

        if (!rowCount) {
            return res.status(404).json([])
        }

        return res.json(rows)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const editarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const idUsuario = req.usuario.id
    const idTransacao = req.params.id

    try {
        const seExisteTransacao = await buscarTransacao(idTransacao, idUsuario) // função em utils/funcoes.js

        if (!seExisteTransacao.rowCount) {
            return res.status(404).json({ mensagem: "Não existe transação para este usuário." })
        }

        const query = `UPDATE transacoes SET 
        descricao = $1, 
        valor = $2, 
        data = $3, 
        categoria_id = $4, 
        tipo = $5 
        WHERE id = $6`

        await pool.query(query, [descricao, valor, data, categoria_id, tipo, idTransacao])

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const excluirTransacao = async (req, res) => {
    const idTransacao = req.params.id
    const idUsuario = req.usuario.id

    try {
        const seExisteTransacao = await buscarTransacao(idTransacao, idUsuario) // função em utils/funcoes.js

        if (!seExisteTransacao.rowCount) {
            return res.status(404).json({ mensagem: "Não existe transação para este usuário." })
        }
        const query = `DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2`

        await pool.query(query, [idTransacao, idUsuario])
        return res.status(200).json()

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const extratoTransacoes = async (req, res) => {
    const idUsuario = req.usuario.id

    try {
        const seExisteTransacao = `SELECT * FROM transacoes WHERE usuario_id = $1`

        const { rows, rowCount } = await pool.query(seExisteTransacao, [idUsuario])
        console.log(rows)
        if (!rowCount) {
            return res.status(404).json({ mensagem: "Não existe transação para este usuário." })
        }

        const query = `SELECT
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS valor_entrada,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS valor_saida
        FROM transacoes
        WHERE usuario_id = $1`

        const resultado = await pool.query(query, [idUsuario])
        return res.status(200).json(resultado.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

module.exports = {
    listarCategorias,
    cadastrarTransacoes,
    detalharTransacao,
    listarTransacoes,
    editarTransacao,
    excluirTransacao,
    extratoTransacoes
};
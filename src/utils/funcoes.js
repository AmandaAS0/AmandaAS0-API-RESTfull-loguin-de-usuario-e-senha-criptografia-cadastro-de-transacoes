const pool = require("../config/conexao");

const queryCategoria = async (id) => {
    const query = "SELECT descricao AS categoria_nome FROM categorias WHERE id = $1"

    const categoria = pool.query(query, [id])

    return categoria
}

const buscarTransacao = async (id, usuario_id) => {
    const query = `SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2`

    const transacao = await pool.query(query, [id, usuario_id])

    return transacao
}


module.exports = {
    queryCategoria,
    buscarTransacao
}
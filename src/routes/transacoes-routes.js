const { Router } = require('express');
const controllers = require('../controllers/transacoes-controllers');
const autenticacaoUsuario = require('../middlewares/autenticacaoUsuario')
const validacoesTransacao = require('../middlewares/validacoesTransacao')

const router = Router();

router.use(autenticacaoUsuario);

router.get('/categorias', controllers.listarCategorias)
router.get('/transacao', controllers.listarTransacoes)
router.post('/transacao', validacoesTransacao, controllers.cadastrarTransacoes)
router.get('/transacao/extrato', controllers.extratoTransacoes)
router.get('/transacao/:id', controllers.detalharTransacao)
router.put('/transacao/:id', validacoesTransacao, controllers.editarTransacao)
router.delete('/transacao/:id', controllers.excluirTransacao)

module.exports = router;
const { Router } = require('express');
const controllers = require('../controllers/usuario-controllers');
const autenticacaoUsuario = require('../middlewares/autenticacaoUsuario');
const validacoesUsuario = require('../middlewares/validacoesUsuario');

const router = Router();

router.post('/usuario', validacoesUsuario, controllers.cadastrarUsuario)
router.post('/login', controllers.loginUsuario)

router.use(autenticacaoUsuario)

router.get('/usuario', controllers.detalharUsuario)
router.put('/usuario', validacoesUsuario, controllers.atualizarDadosUsuario)

module.exports = router;
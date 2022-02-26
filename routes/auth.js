// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Iniciar sesión
// api/auth

router.post('/',
    authController.autenticarUsuario
);

// Obtiene el usario autenticado
router.get('/',
    auth,
    authController.usuarioAtenticado
)

module.exports = router;
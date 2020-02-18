var express = require('express');
var router = express.Router();

let ventas = require("../controllers/ventas");
/* GET home page. */
router.get('/', ventas.principal);


router.post('/', ventas.registrar_venta);
module.exports = router;

router.post('/redirect', ventas.volverInicio);
module.exports = router;

router.post('/ventas', ventas.ventas);
module.exports = router;

router.post('/vendidas', ventas.vendidas);
module.exports = router;

router.post('/vendedores', ventas.vendedores);
module.exports = router;



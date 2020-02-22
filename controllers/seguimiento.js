
function oracleQuery(pagina, query, res, cat){

    retornar(function(tabla)
    {
      var tablas = [];
      var keys = [];
      for (var i = 0;i<tabla.length;i++)
      {
        tablas = tabla;
      }
      var keys = Object.keys(tablas[0]);
      res.render(pagina,{tabla: {tablas:tablas, keys:keys,cat:cat}});
    }, query);
  
  
  }

exports.seguimiento = function (req, res, next) {

    consulta = 'SELECT M.CODIGO_MOV, M.CODIGO_CAJA,C.CODIGO_COMPRA ,P.NOMBRE_PROVEEDOR FROM MOVIMIENTO M, COMPRAS C, PROVEEDOR P WHERE M.CODIGO_COMPRA = C.CODIGO_COMPRA AND C.CODIGO_PROVEEDOR = P.CODIGO_PROVEEDOR AND CODIGO_CAJA = (SELECT MO.CODIGO_CAJA FROM VENTAS V, MOVIMIENTO MO WHERE V.CODIGO_VENTA = 1 AND V.CODIGO_VENTA = MO.CODIGO_VENTA)';
    
    oracleQuery('index', consulta, res, 'Seguimiento de montura');
    
    }
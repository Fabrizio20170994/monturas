
  
  // Función boilerplate para conectarse a la Base de Datos
  const oracledb = require('oracledb');
  oracledb.autoCommit = true;
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
  const mypw = '322'


  async function retornar(_callback, query) {
    var tabla;
  
    let connection;
  
    try {
      connection = await oracledb.getConnection({
        user: "SYS",
        password: mypw,
        connectString: "localhost/xe",
        privilege: oracledb.SYSDBA
      });
  
      const result = await connection.execute(
        query
  
      );
        tabla = result.rows;
        _callback(tabla);
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
          
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  


// Principal función que se encargara de renderizar las tablas consultadas según un query ingresado
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



// Página principal que cargará los datos necesarios para el registro de venta
exports.principal = async function (req, res, next) {

  qClientes = 'SELECT * FROM CLIENTE';
  qVendedores = 'SELECT * FROM VENDEDOR';
  qMonturas = 'SELECT * FROM MONTURAS';

retornar(function(clientes){
  retornar(function(vendedores){
    retornar(function(monturas){
      res.render('landing',{tablas:{clientes:clientes,vendedores:vendedores,monturas:monturas}});
    } ,qMonturas);
  } ,qVendedores);
}, qClientes);



}


// Cada función se encarga de manejar una consulta de datos y pasarla a la función oracleQuery() para renderizarla
exports.vendedores = function (req, res, next) {

var año = req.body.año_vendedores;
var cantidad = req.body.n_vendedores;
consulta = 'SELECT M.CODIGO_VENDEDOR, M.NOMBRE ,COUNT(*) AS NRO_VENTAS FROM VENTAS V, VENDEDOR M WHERE V.CODIGO_VENDEDOR=M.CODIGO_VENDEDOR and EXTRACT (YEAR FROM v.fecha_venta)= ' + año + ' GROUP BY M.CODIGO_VENDEDOR, M.NOMBRE HAVING COUNT(*) > (SELECT AVG(NRO_VENTAS)  FROM (SELECT M.CODIGO_VENDEDOR, COUNT(*) AS NRO_VENTAS FROM VENDEDOR M, VENTAS V WHERE M.CODIGO_VENDEDOR = V.CODIGO_VENDEDOR GROUP BY M.CODIGO_VENDEDOR)) ORDER BY NRO_VENTAS DESC FETCH FIRST '+ cantidad +'ROWS ONLY';

oracleQuery('index',consulta,res, 'Registro de mejores vendedores');

}


exports.vendidas = function (req, res, next) {

  var año = req.body.año_monturas;
  var cantidad = req.body.n_monturas;
  consulta = 'SELECT M.CODIGO_MONTURA,COUNT(*) AS NRO_VENTAS FROM VENTAS V, MONTURAS M WHERE V.CODIGO_MONTURA=M.CODIGO_MONTURA and EXTRACT (YEAR FROM v.fecha_venta)= ' + año + ' GROUP BY M.CODIGO_MONTURA HAVING COUNT(*) > (SELECT AVG(NRO_VENTAS) FROM (SELECT M.CODIGO_MONTURA, COUNT(*) AS NRO_VENTAS FROM MONTURAS M, VENTAS V WHERE M.CODIGO_MONTURA = V.CODIGO_MONTURA GROUP BY M.CODIGO_MONTURA)) ORDER BY NRO_VENTAS DESC FETCH FIRST '+ cantidad +' ROWS ONLY';
  oracleQuery('index',consulta,res, 'Registro monturas más vendidas');

}



exports.monturas = function (req, res, next) {


  oracleQuery('index',"select codigo_montura, EXTRACT (DAY FROM FECHA_DISEÑO) || '/' || EXTRACT (MONTH FROM FECHA_DISEÑO) || '/' || EXTRACT (YEAR FROM FECHA_DISEÑO) AS FECHA_DISEÑO , marca, tipo_lente, calibre, ancho_puente, long_varilla, color, precio_u, existencias from monturas",res,'Stock');
  
  }




exports.ventas = function (req, res, next) {

oracleQuery('index',"SELECT CODIGO_VENTA, CODIGO_CLIENTE, CODIGO_MONTURA, MEDIDA_P, MEDIDA_S, CANTIDAD, MONTO, MODALIDAD, CODIGO_VENDEDOR, EXTRACT (DAY FROM FECHA_VENTA) || '/' || EXTRACT (MONTH FROM FECHA_VENTA) || '/' || EXTRACT (YEAR FROM FECHA_VENTA) AS FECHA_VENTA FROM VENTAS",res, 'Registro de Ventas');

}




exports.volverInicio = function (req, res, next) {
    res.redirect('/');
}




exports.movimientos = function (req, res, next) {
  var montura = req.body.montura_movimientos;
  console.log(montura);
  var query = "SELECT * FROM MOVIMIENTO WHERE CODIGO_MONTURA = " + montura;
  oracleQuery('movimientos',query,res);
}





exports.seguimiento = function (req, res, next) {

  codigo = req.body.codigo_seguimiento;
  consulta = 'SELECT M.CODIGO_MOV, M.CODIGO_CAJA,C.CODIGO_COMPRA ,P.NOMBRE_PROVEEDOR FROM MOVIMIENTO M, COMPRAS C, PROVEEDOR P WHERE M.CODIGO_COMPRA = C.CODIGO_COMPRA AND C.CODIGO_PROVEEDOR = P.CODIGO_PROVEEDOR AND CODIGO_CAJA = (SELECT MO.CODIGO_CAJA FROM VENTAS V, MOVIMIENTO MO WHERE V.CODIGO_VENTA = ' + codigo + ' AND V.CODIGO_VENTA = MO.CODIGO_VENTA)';
  
  oracleQuery('index', consulta, res, 'Seguimiento de Ventas');
  
}


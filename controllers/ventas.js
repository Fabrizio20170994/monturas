
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
  



function oracleQuery(pagina, query, res){

  retornar(function(tabla)
  {
    var tablas = [];
    var keys = [];
    for (var i = 0;i<tabla.length;i++)
    {
      tablas = tabla;
    }
    var keys = Object.keys(tablas[0]);
    res.render(pagina,{tabla: {tablas:tablas, keys:keys}});
  }, query);


}




exports.principal = async function (req, res, next) {

  qClientes = 'SELECT * FROM CLIENTE';
  qVendedores = 'SELECT * FROM VENDEDOR';
  qMonturas = 'SELECT * FROM MONTURAS';

retornar(function(clientes){
  retornar(function(vendedores){
    retornar(function(monturas){
      console.log(clientes);
      console.log(vendedores);
      console.log(monturas);
      res.render('landing',{tablas:{clientes:clientes,vendedores:vendedores,monturas:monturas}});
    } ,qMonturas);
  } ,qVendedores);
}, qClientes);




}


exports.vendedores = function (req, res, next) {

consulta = 'SELECT  M.CODIGO_VENDEDOR, M.NOMBRE, COUNT(*) AS NRO_VENTAS FROM VENDEDOR M, VENTAS V WHERE V.CODIGO_VENDEDOR=M.CODIGO_VENDEDOR GROUP BY (M.NOMBRE,M.CODIGO_VENDEDOR) HAVING COUNT(*)>(SELECT AVG(NRO_VENTAS) FROM (SELECT M.CODIGO_VENDEDOR, COUNT(*) AS NRO_VENTAS FROM VENDEDOR M, VENTAS V WHERE M.CODIGO_VENDEDOR = V.CODIGO_VENDEDOR GROUP BY M.CODIGO_VENDEDOR))'

oracleQuery('vendedores',consulta,res);

}


exports.vendidas = function (req, res, next) {

  consulta = 'SELECT M.CODIGO_MONTURA, COUNT(*) AS NRO_VENTAS FROM VENTAS V, MONTURAS M WHERE V.CODIGO_MONTURA=M.CODIGO_MONTURA GROUP BY (V.CODIGO_MONTURA) HAVING COUNT(*) > (SELECT AVG(NRO_VENTAS) FROM (SELECT M.CODIGO_MONTURA, COUNT(*) AS NRO_VENTAS FROM MONTURAS M, VENTAS V WHERE M.CODIGO_MONTURA = V.CODIGO_MONTURA GROUP BY M.CODIGO_MONTURA))'
  oracleQuery('monturas',consulta,res);

}



exports.monturas = function (req, res, next) {

  oracleQuery('stock',"select codigo_montura, EXTRACT (DAY FROM FECHA_DISEÑO) || '/' || EXTRACT (MONTH FROM FECHA_DISEÑO) || '/' || EXTRACT (YEAR FROM FECHA_DISEÑO) AS FECHA_DISEÑO , marca, tipo_lente, calibre, ancho_puente, long_varilla, color, precio_u, existencias from monturas",res);
  
  }







exports.ventas = function (req, res, next) {

oracleQuery('index','SELECT * FROM VENTAS',res);

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
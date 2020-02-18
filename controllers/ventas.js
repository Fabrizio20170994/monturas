exports.principal = function (req, res, next) {


}

exports.vendedores = function (req, res, next) {


}


exports.vendidas = function (req, res, next) {


}





exports.ventas = function (req, res, next) {

  const oracledb = require('oracledb');
  oracledb.autoCommit = true;
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  const mypw = '322' // set mypw to the hr schema password

  async function run(_callback) {
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
        `SELECT * FROM VENTAS`
        // bind value for :id
        
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

  function esperar()
{
  run(function(tabla)
  {
    var clientes = [];
    for (var i = 0;i<tabla.length;i++)
    {
      clientes = tabla;
    }
    console.log(clientes);
    res.render('index',{tabla:clientes});
  });
}

esperar();

}

exports.registrar_venta = function (req, res, next) {
  var medida_p = parseFloat(req.body.venta_medida_p);
  var medida_s = parseFloat(req.body.venta_medida_s);
  var codigo_cliente = req.body.venta_codigo_cliente ;
  var modalidad = req.body.venta_modalidad;
  var codigo_montura = parseInt(req.body.venta_codigo_montura);
  var codigo_vendedor = req.body.venta_codigo_vendedor;
  var cantidad = parseInt(req.body.venta_cantidad);
  var monto = parseInt(req.body.venta_monto);

  console.log("Se envió: ", req.body.venta_medida_p);
  const oracledb = require('oracledb');
  oracledb.autoCommit = true;
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  const mypw = '322' // set mypw to the hr schema password

  async function run() {

    let connection;

    try {
      connection = await oracledb.getConnection({
        user: "SYS",
        password: mypw,
        connectString: "localhost/xe",
        privilege: oracledb.SYSDBA
      });

      const result = await connection.execute(
        `BEGIN
          REGISTRAR_VENTA(:cantidad,:codigo_cliente,:codigo_montura,:medida_p,:medida_s,:monto,:modalidad,:codigo_vendedor);
      END;`, {
          medida_p: medida_p,
          medida_s: medida_s,
          codigo_cliente: codigo_cliente,
          modalidad: modalidad,
          codigo_montura: codigo_montura,
          codigo_vendedor: codigo_vendedor,
          cantidad: cantidad,
          monto: monto
        }
      );  

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


  run();
  /*
  let obj = {
    1: 'one',
    2: 'two',
    3: 'three'
  }
  let template = ""
  let result = '<table>';
  for (let el in obj) {
    result += "<tr><td>" + el + "</td><td>" + obj[el] + "</td></tr>";
  }
  result += '</table>';

  res.send(result);
  */
  //res.redirect('/');
}

exports.volverInicio = function (req, res, next) {
    res.redirect('/');
}
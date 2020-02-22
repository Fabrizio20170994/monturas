
// Función encargada de inserción de vendedores a la BD
exports.registrar_venta = function (req, res, next) {
    var medida_p = parseFloat(req.body.venta_medida_p);
    var medida_s = parseFloat(req.body.venta_medida_s);
    var codigo_cliente = req.body.venta_codigo_cliente ;
    var modalidad = req.body.venta_modalidad;
    var codigo_montura = parseInt(req.body.venta_codigo_montura);
    var codigo_vendedor = req.body.venta_codigo_vendedor;
    var cantidad = parseInt(req.body.venta_cantidad);
    var monto = parseInt(req.body.venta_monto);
    var fecha_venta = req.body.fecha_venta
    console.log(fecha_venta);
    const oracledb = require('oracledb');
    oracledb.autoCommit = true;
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
  
    const mypw = '322'
  
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
            REGISTRAR_VENTA(:cantidad,:codigo_cliente,:codigo_montura,:medida_p,:medida_s,:monto,:modalidad,:codigo_vendedor,TO_DATE(:fecha_venta,'YYYY-MM-DD'));
        END;`, {
            medida_p: medida_p,
            medida_s: medida_s,
            codigo_cliente: codigo_cliente,
            modalidad: modalidad,
            codigo_montura: codigo_montura,
            codigo_vendedor: codigo_vendedor,
            cantidad: cantidad,
            monto: monto,
            fecha_venta:fecha_venta
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
    res.redirect('/');
  }
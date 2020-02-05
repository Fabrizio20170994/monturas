
prueba = [2,2,2,2];


function crearTabla() {
    $("#table_div tr").remove();
    jQuery.each(prueba, function(index, value) {
        $("#table_div").append("<tr><td>" + value + "</td></tr>");
    });
}


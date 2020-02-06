
prueba = [2,2,2,2];

styleMode = 0;

function crearTabla() {
    $("#table_div tr").remove();
    jQuery.each(prueba, function(index, value) {
        $("#table_div").append("<tr><td>" + value + "</td></tr>");
    });
}

function toogleNightMode() {
    if (styleMode == 0) {
        $( "body" ).css( "background-color", "#fff" );
        $( "body" ).css( "color", "black" );
        $( ".table" ).css( "color", "black" );
    }
    else {
        $( "body" ).css( "background-color", "#343a40" );
        $( "body" ).css( "color", "#fff" );
        $( ".table" ).css( "color", "#fff" );
    }
    styleMode = !styleMode;
}


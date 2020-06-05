var reg = '', //Variables globales que guardan los datos de la Region, provincia y comuna.
    com = '',
    prov = '',
    cont = 0;

var JSONcom = {}, //Variables que guardaran la informacion de los archivos .json para poder ser utilizadas fuera de la funcion $.getJSON
    JSONreg = {};

var personas = [];

$.getJSON("region.json", function(regiones) {
    $.getJSON("comuna.json", function(comunas){ //funciones para tener acceso a los archivos .json de comunas y regiones
    
        function cargar_regiones(){ //Funcion encargada de cargar todas las regiones en el select(region_sl) del html

            for (let i = 0; i < regiones.length; i++) { //Bucle para recorrer todas las posciciones del array de regiones.
                reg += '<option value="'+regiones[i].id+'">'+regiones[i].nombre+'</option>'; //Concatenamos todas las posiciones del array en 1 cadena para mandarla al archivo HTML
            }
            document.getElementById('region_sl').innerHTML = reg; //Escribimos dentro del select de las regiones sus opciones correspondientes
        };
        
        cargar_regiones(); // Cargamos el select de region con su informacion

        JSONreg = regiones; 
        JSONcom = comunas;

        cargar_comunas_regiones(); //Cargamos el select de comunas con su informacion
        cargar_provincia(); //Carga el select de provincias con la provincia de la comuna correspondiente

    });
});

function cargar_comunas_regiones() { //Funcion encargada de cargar la informacion en el select de las comunas
            
    com_abuscar = document.formulario1.region[document.formulario1.region.selectedIndex].value; //obtenemos el valor actual seleccionado en el select de regiones para saber que ID buscar
    
    com = ''; //Reiniciamos el string que se encarga de las opciones mostradas en el select de comunas

    if (com_abuscar != 0 && com_abuscar <= JSONreg.length) { // Condicional que indica el rango de donde a donde buscar        

        for (let i = 0; i < JSONcom.length; i++) { // Bucle para recorrer todas las posiciones de comuna.json

            if (JSONcom[i].region_id == com_abuscar) {
               
                com += '<option value="'+JSONcom[i].nombre+'">'+JSONcom[i].nombre+'</option>'; // Guardamos todas las comunas como un string para asi crear las opciones en el html
            }   
        }

    } 
    
    document.getElementById('comuna_sl').innerHTML = com; // Escribimos las comunas correspondientes de cada region.
}

function cargar_provincia() {

    prov_abuscar = document.formulario1.comuna[document.formulario1.comuna.selectedIndex].value; //guardamos el valor seleccionado de la comuna
   
    i=0; 

    while (JSONcom[i].nombre != prov_abuscar) { //Recorremos el array de las comunas hasta encontrar la provincia deseada
            i++;
    }

    document.getElementById('provincia_sl').innerHTML = '<option value="'+JSONcom[i].id+'">'+JSONcom[i].provincia+'</option>'; //Escribimos la provincia en el select correspondiente, este select no podra ser editado.

} // fin de la funcion cargar_provincia()



function agregar() { //Funcion encargada de agregar datos a la tabla de usuarios registrados

    var nombres = document.getElementById('nombres_txt').value; //Obtenemos todos los valores de los cuadros de texto del HTML
    var apellido_p = document.getElementById('ap_p_txt').value;
    var apellido_m = document.getElementById('ap_m_txt').value;
    var direccion = document.getElementById('direccion_txt').value;
    var region = document.getElementById('region_sl').value;
    var comuna = document.getElementById('comuna_sl').value;
    var provincia = document.getElementById('provincia_sl').value;
    
    //Con las siguientes lineas eliminamos los caracteres especiales que se ingresen en los campos de texto.
    nombres = nombres.replace(/[^a-zA-Z ]/g, "");
    apellido_p = apellido_p.replace(/[^a-zA-Z ]/g, "");
    apellido_m = apellido_m.replace(/[^a-zA-Z ]/g, "");
    direccion = direccion.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    
    var persona = {nombre:nombres, apep:apellido_p, apem:apellido_m, dir:direccion, reg:region, com:comuna, pro:provincia};

    if (nombres == '' || apellido_p == '' || apellido_m == '' || direccion == '') { // Establecemos el condicional para que no puedan estar los cuadros de texto vacios
        alert('Debe llenar los datos antes de agregar');
    } else {

        if (cont==0) {  //Para la primera persona agregada a la variable global personas. (esto lo hacemos porque la 1ra posicion que se agregara a la tabla no evalua si sus datos estan en la tabla)
            
            personas[cont] = persona;

            document.getElementById('tabla_d').innerHTML += // En caso de que no hayan espacios en blanco escribimos en la tabla
            '<tr style="background: #bfffd5">'
            +'<td><label>'+nombres+'</label></td>'
            +'<td><label>'+apellido_p+'</label></td>'
            +'<td><label>'+apellido_m+'</label></td>'
            +'<td><label>'+direccion+'</label></td>'
            +'<td><label>'+document.getElementById('comuna_sl').value+'</label></td>'
            +'</tr>';
            cont++;
            console.log(personas);

        } else { //Cuando ya agregamos a la primera persona.

            var found = personas.find(function(post){//funcion encargada de evaluar si el valor post se encuentra dentro del arreglo personas.
                if ((post.nombre == persona.nombre) && ((post.apep == persona.apep) && (post.apem == persona.apem)) && (post.dir == persona.dir)) { //Si encontramos a la persona dentro del array devolvemos true, si no la funcion devuelve 'undefined'
                    return true;                       
                }
            });

            if ( found != undefined) { //si la funcion .find devuelve true manda una alerta
 
                alert('Los datos de la persona ya estan en la tabla.');
            } else { //si es diferente de true agregamos a la persona nueva a nuestro array de personas e insertamos sus datos en la tabla para mostrarlos
                
                personas[cont] = persona; //las posiciones del array global las controlamos con un contador tambien global.
                
                document.getElementById('tabla_d').innerHTML += 
                '<tr style="background: #bfffd5">'
                +'<td><label>'+nombres+'</label></td>'
                +'<td><label>'+apellido_p+'</label></td>'
                +'<td><label>'+apellido_m+'</label></td>'
                +'<td><label>'+direccion+'</label></td>'
                +'<td><label>'+document.getElementById('comuna_sl').value+'</label></td>'
                +'</tr>';

                cont++;
                console.log(personas);

            } //fin del else

        } //fin del else    

    } //fin del else 
    
} //fin de la funcion agregar()

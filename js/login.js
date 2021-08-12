//JavaScript Document

//Para que IndexedDB funcione en todos los navegadores
window.indexedDb = window.indexedDb || window.mozIndexedDB ||
window.webkitIndexedDB || window.msIndexedDB

//Definimos las variables Globales (Variables del programa)
var bd;
var zonadatos;
var cursor;
var cuenta = 0;

function iniciar(){
	//alert("Se inicia el programa");
	console.log("Se inicia el programa");

	//1. Definir los elementos de la página
	txtNombre = document.getElementById("nombre");
	txtApellido = document.getElementById("apellido");
	edad = document.getElementById("edad");
	txtUsuario = document.getElementById("usuario");
	txtClave = document.getElementById("contrasena");
	btnVerUsuarios = document.getElementById("VerUsuarios");
	btnRegistrar = document.getElementById("Registrar");
	btnBuscar = document.getElementById("Buscar");
	btnActualizar = document.getElementById("Actualizar");
	btnEliminar = document.getElementById("Eliminar");
	btnSiguiente = document.getElementById("Siguiente");
	btnAnterior = document.getElementById("Anterior");
	zonadatos = document.getElementById("zonadatos");

	//Ponemos "a la escucha" los botones
	btnVerUsuarios.addEventListener("click", VerUsuarios, false);
	btnRegistrar.addEventListener("click", Registrar, false);
	btnBuscar.addEventListener("click", Buscar, false);
	btnActualizar.addEventListener("click", Actualizar, false);
	btnEliminar.addEventListener("click", Eliminar, false);
	btnSiguiente.addEventListener("click", Siguiente, false);
	btnAnterior.addEventListener("click", Anterior, false);

//2.Creamos la Base de Datos
	var solicitud = indexedDB.open("come");
	//onsuccess: Evento que verifica la creación de la base de datos
	//onupgradeneeded: Evento de actualizar la base de datos
	solicitud.onsuccess = function(e){
		//Guardamos la Base de Datos en la variable (bd)
		bd = e.target.result;
		//alert("La base de datos se conectó con éxito");
	}
	//Creamos los almacenes de bases de datos (Tablas) --> gente - usuarios
	solicitud.onupgradeneeded = function(e){
		//Este evento sólo se ejecuta la primera vez que se crea la Base de Datos
		bd = e.target.result;
		bd.createObjectStore("gente", {keyPath: "clave"});
		var tbUsuarios = bd.createObjectStore("usuarios", {keyPath: "apellido"});
		//Definimos los índices adicionales para el almacén "usuarios"
		tbUsuarios.createIndex("nombre","nombre", {unique: false});
		tbUsuarios.createIndex("usuario","usuario", {unique: false});
	}
}

function VerUsuarios(){ //Función anónima: Sin Parámetros
	//alert("Presionaste el botón Ver Usuarios");
	//Limpiamos la zonadatos
	cuenta = 0;
	zonadatos.innerHTML = ""; //Incrusta código HTML
	var transaccion = bd.transaction(["usuarios"], "readonly");
	var almacen = transaccion.objectStore("usuarios");
	//Creamos un CURSOR con el Método de la API: openCursor
	cursor = almacen.openCursor();
	//Si tiene éxito al abrir el cursor ......
	cursor.addEventListener("success", mostrarDatosUsuarios, false);
}

function mostrarDatosUsuarios(e){
	//Esta función recibe como parámetro el evento del cursor
	//alert("Mostrar Datos usuarios");
	var cursor = e.target.result;
	//Si el cursor está abierto
	if (cursor){
		zonadatos.innerHTML += "<div>" + cuenta + " --> " + cursor.value.apellido +
		 " - " + cursor.value.nombre + " - " + cursor.value.edad + " - " +
		  cursor.value.usuario + "</div>";
		//Seguimos leyendo el cursor
		cursor.continue();
		cuenta = cuenta + 1;
	}
	document.getElementById("apellido").value = cursor.value.apellido;
	document.getElementById("nombre").value = cursor.value.nombre;
	document.getElementById("edad").value = cursor.value.edad;
	document.getElementById("usuario").value = cursor.value.usuario;
	document.getElementById("contrasena").value = cursor.value.clave;
	if (cuenta == 0){
		alert("Datos NO encontrados");
	}
}

function Registrar(){
	//Función para agregar objetos (Registros) a la Base de Datos
	console.log("Presionaste el botón Registrar");
	//Recuperamos y guardamos en variables los campos del formulario
	var apellido = document.getElementById("apellido").value;
	var nombre = document.getElementById("nombre").value;
	var edad = document.getElementById("edad").value;
	var usuario = document.getElementById("usuario").value;
	var clave = document.getElementById("contrasena").value;
	//Agregamos al almacén de datos los objetos (registros)
	//Creamos la transacción al almacén "usuarios" para lecto-escritura
	var transaccion = bd.transaction(["usuarios"], "readwrite");
	//Guardamos en la variable "almacen" la transacción
	var almacen = transaccion.objectStore("usuarios");
	//Agregamos los datos del objeto (Registro) a los "Campos"
	//utilizando el Método add de la API IndexedDB
	var agregar = almacen.add({apellido: apellido, nombre: nombre,
		edad: edad,  usuario: usuario, clave: clave});
	//Verificamos si se realizó con éxito la adición de los datos
	//agregar.addEventListener("success", VerUsuarios, false);
	alert("El Registro se realizó con éxito");
	window.open("inicio de sesion.html", "_Top"); //"_Target"
	Limpiar();
}

function Limpiar(){
	//Limpia el formulario del registro
	document.getElementById("nombre").value = "";
	document.getElementById("apellido").value = "";
	document.getElementById("edad").value = "";
	document.getElementById("usuario").value = "";
	document.getElementById("contrasena").value = "";
}

function Buscar(){
	//alert("Presionaste el botón Buscar");
	zonadatos.innerHTML = "";
	if (document.getElementById("apellido").value !== ""){
		BuscarApellido();
	}
	if (document.getElementById("nombre").value !== ""){
		BuscarNombre();
	}
}

function BuscarApellido(){
	alert("Buscar Apellido");
	cuenta = 0;
	var transaccion = bd.transaction(["usuarios"], "readonly");
	var almacen = transaccion.objectStore("usuarios");
	//Creamos el CURSOR que mostrará el OBJETO (REGISTRO)
	//Se puede especificar el RANGO y la DIRECCIÓN
	//El rango determinará qué valores se tienen en cuenta, como un filtro (null : Sin Filtro) 
	//El cursor indica en que registro nos encontramos
	var buscaras = txtApellido.value;
	var ver = IDBKeyRange.only(buscaras);
	var cursor = almacen.openCursor(ver, "next");
	//Si tiene éxito al abrir el cursor
	cursor.addEventListener("success", mostrarDatosUsuarios, false);
}

function BuscarNombre(){
	//alert("Buscar Nombre");
	cuenta = 0;
	var bNombre = txtNombre.value;
	//Creamos
	var transaccion = bd.transaction(["usuarios"], "readwrite");
	var almacen = transaccion.objectStore("usuarios");
	var index = almacen.index("nombre");
	var cursor = index.openCursor(bNombre);
	//Si tiene éxito al abrir el cursor
	cursor.addEventListener("success", mostrarDatosUsuarios, false);
}

function Actualizar(){
	//alert("Presionaste el botón Actualizar");
	var nombre = document.getElementById("nombre").value;
	var apellido = document.getElementById("apellido").value;
	var edad = document.getElementById("edad").value;
	var usuario = document.getElementById("usuario").value;
	var clave = document.getElementById("contrasena").value;
	//Creamos la Transacción
	var transaccion = bd.transaction(["usuarios"], "readwrite");
	var almacen = transaccion.objectStore("usuarios");
	var request = almacen.put({apellido: apellido, nombre: nombre,
	 edad: edad, usuario: usuario, clave: clave});
	request.onsuccess = function (e){
		alert("Se actualizó el REGISTRO");
	}
	request.onerror = function(e){
		alert("ocurrió un error en la ACTUALIZACIÓN");
	}
}

function Eliminar(){
	//alert("Presionaste el botón Eliminar");
	var bApellido = txtApellido.value;
	//Creamos la Transacción
	var transaccion = bd.transaction(["usuarios"], "readwrite");
	var almacen = transaccion.objectStore("usuarios");
	var request = almacen.delete(bApellido);
	request.onsuccess = function (e){
		alert("Se eliminó el REGISTRO");
	}
	request.onerror = function(e){
		alert("Ocurrió un error al BORRAR el REGISTRO");
	}
}

function Siguiente(){
	console.log("Presionaste el botón Siguiente");
}
function Anterior(){
	console.log("Presionaste el botón Anterior");
}



//Se ejecuta al cargar la página
//Se coloca el navegador "a la escucha"
window.addEventListener("load", iniciar, false);
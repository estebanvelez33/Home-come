//JavaScript Document

//Para que IndexedDB funcione en todos los navegadores
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
window.webkitIndexedDB || window.msIndexedDB

//Defino las variables de programa (Variables de Entorno o Globales)
var txtUsuario;
var txtClave;
var bd;

function iniciar(){    //FUNCIÓN ANÓNIMA
	//alert("Se inicia Login");
	console.log("Se inicia Login");

	//1. Definir los elementos de la página
	txtUsuario = document.getElementById("login");
	txtClave = document.getElementById("logContra");
	
	btnLogin = document.getElementById("BtnLogin");
	//Ponemos "a la escucha" los botones
	btnLogin.addEventListener("click", VerificarLogin, false);

	//Nos conectamos a la base de datos 
	var solicitud = indexedDB.open("come");
	//Verificamos la apertura de la base de datos
	solicitud.onsuccess = function (e){
		bd = e.target.result;
	//	alert("La base de datos se abrió con éxito");
	}
}

function VerificarLogin(){
	//alert("Se verifica Login");
	//alert("Usuario: " + txtUsuario.value);
	//alert("Contraseña: " + txtClave.value);
	var bUsuario = txtUsuario.value;
	var transaccion = bd.transaction(["usuarios"], "readwrite");
	var almacen = transaccion.objectStore("usuarios");
	var index = almacen.index("usuario");
	var request = index.openCursor(bUsuario);
	//alert("Usuario: " + txtUsuario.value);
	request.onsuccess = function (e){
		var cursor = e.target.result;
		if (cursor) {
			var SisUsuario = cursor.value.usuario;
			var SisClave = cursor.value.clave;
			//alert(SisUsuario + " - " + SisClave);
		}
		if (SisUsuario == txtUsuario.value && SisClave == txtClave.value){
			alert("Login CORRECTO . . . Vamos a Inicio");
			window.open("inicio.html",'_top');
		}else{
			alert("Login INCORRECTO...!!!");
		}
	}
}

//Se ejecuta al cargar la página
//Se coloca el navegador "a la escucha"
window.addEventListener("load", iniciar, false);
var app = angular.module('desireToursApp',['ionic', 'firebase', 'ui.mask', 'jcs-autoValidate']);

app.controller('mainCtrl', ['$scope','$stateParams','$ionicPopup', function($scope, $stateParams,$ionicPopup){
  
	$scope.configUsu = {
        apiKey: "AIzaSyAv3Dxl3mRN8O0VW0e6qwv3ND36-qR7rN8",
        authDomain: "appdesiretours.firebaseapp.com",
        databaseURL: "https://appdesiretours.firebaseio.com",
        projectId: "appdesiretours",
        storageBucket: "",
        messagingSenderId: "343301322521"
    };
    firebase.initializeApp($scope.configUsu);
    $scope.paginaLogin = 'paginas/menuDesireTours.html';
    $scope.MenuAdmin=false;
    $scope.MenuCliente=false;
    $scope.idUsuario=null;
    $scope.tituloLogin = "Iniciar sesión";
    $scope.NombreUsuario = null;
    $scope.bienvenida = null;
    $scope.linkAtras=null;
    $scope.mostrarBtnMenu=false;
    $scope.mostrarBtnAtras=false;
    $scope.mostrarFormLogin=false;

    //Funcion para mostrar los datos del usuario
    $scope.InicioSesion=function(nombre , genero, idUsuario, esCliente){
        $scope.MenuAdmin = esCliente == 0 ? true : false;
        $scope.MenuCliente = esCliente == 1 ? true : false;
        $scope.mostrarFormLogin=true;
        $scope.NombreUsuario=nombre;
        $scope.bienvenida = genero=="M" ? "Bienvenido" : "Bienvenida";
        $scope.tituloLogin = "Cerrar sesión";
        $scope.idUsuario=idUsuario;
    }

    //Funcion que limpia los campos y bloquea el menu para una nueva sesion
    $scope.CerrarSesion=function(){
        $scope.MenuAdmin=false;
        $scope.MenuCliente=false;
        $scope.mostrarFormLogin=false;
        $scope.tituloLogin = "Iniciar sesión";
        $scope.idUsuario=null;
        window.location="#/login/0"
        $scope.vistaBtnMenu(false);
        location.reload();
    }

    //Muestra u oculta el boton del menu
    $scope.vistaBtnMenu = function(valor){
        $scope.mostrarBtnMenu=valor;
    }

    //Muestra u oculta el boton para regresar a la pagina anterior
    $scope.vistaBtnAtras = function(valor){
        $scope.mostrarBtnAtras=valor;
    }

    //activa la funcion del boton para regresar a la pagina anterior
    $scope.accionAtras= function(link){ 
        setTimeout(function(){
            window.location=link+$scope.idUsuario;
            $scope.vistaBtnAtras(false);
            $scope.vistaBtnMenu(true);
            $scope.$apply();
        }, 1000);
    }

    //Obtiene el link anterior
    $scope.obtenerlinkAtras = function(link){
        $scope.linkAtras=link;
    }

    //Funcion para recuperar los datos del usuario cuando se actualiza
    //la pagina
    $scope.recuperarUsuario=function(iniciarSesionAuth){
        var idUsuarioRecuperado= $stateParams.idUsuario;
        if(idUsuarioRecuperado != null)
        {
            var obtenerSesion = firebase.database().ref("Personas");
            obtenerSesion.orderByChild("ususario").on("child_added", function(data) {
                if(data.val().idUsuario==idUsuarioRecuperado)
                {
                    setTimeout(function(){
                        if(iniciarSesionAuth)
                        {
                            firebase.auth().signInWithEmailAndPassword(data.val().usuario, String(data.val().contrasenia))
                            .then(function(snap) {
                                console.log("##### VOLVIO A LOGEARSE EL USUARIO");
                            });
                        }
                        $scope.InicioSesion(data.val().nombre,data.val().genero,data.val().idUsuario, data.val().esCliente);
                        $scope.$apply();
                    }, 1000);
                }
            });
        }
    }

    //Convierte el formato string a tipo date para poder visualizar en los input de tipo date
    $scope.convertirFecha=function(fecha) {
        fecha = new Date(fecha);
        fecha.setDate(fecha.getDate() + 1);
        return fecha;
    }

    //muestra un popup con mensaje personalizado
    $scope.showAlert = function(titulo, mensaje, activarAtras) {
        var popMensaje = $ionicPopup.alert({
            title: titulo,
            content: mensaje
        });
        popMensaje.then(function() {
            $scope.vistaBtnAtras(false);
            if(activarAtras)
            {
                $scope.accionAtras($scope.linkAtras);
            }   
        });
    };

    //Funcion que ordena la lista de viajes para el cliente
    $scope.sortBy = (function () {

            const _defaults = {
                parser: (x) => x,
                desc: false
            };

            const isObject = (o) => o !== null && typeof o === "object";
            const isDefined = (v) => typeof v !== "undefined";

            //gets the item to be sorted
            function getItem (x) {
                const isProp = isObject(x) && isDefined(x[this.prop]);
                return this.parser(isProp ? x[this.prop] : x);
            }
            return function (array, options) {
                if (!(array instanceof Array) || !array.length)
                  return [];
                const opt = Object.assign({}, _defaults, options);
                opt.desc = opt.desc ? -1 : 1;
                return array.sort(function (a, b) {
                  a = getItem.call(opt, a);
                  b = getItem.call(opt, b);
                  return opt.desc * (a < b ? -1 : +(a > b));
                });
            };
        }
    ());
}]);
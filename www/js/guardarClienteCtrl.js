app.controller('guardarClienteCtrl', ['$scope', '$firebase','$stateParams','$filter', function($scope, $firebase,$stateParams,$filter){
	
    console.log("entro al controlador de guardar clientes");
    //Funciones de entrada
    $scope.recuperarUsuario();
    if(JSON.parse($stateParams.esCliente))
    {
        $scope.vistaBtnMenu(true);
        console.log("##### entro a la Validacion");
    }
    else
    {
        $scope.vistaBtnMenu(false);
        $scope.vistaBtnAtras(true);
        $scope.obtenerlinkAtras("#/listadoClientes/");
    }

    //Declaracion de variables
    $scope.editarCorreoPass=false;
    $scope.tipoGenero="M";
    $scope.DiaActual = new Date();
    $scope.infoUsuario = {};
    $scope.tituloUsuario = null;
    $scope.usuarioOriginal = null;
    $scope.contraseniaOriginal = null;
    var idPersonaRecuperado= $stateParams.idPersona;
    $scope.idUsuarioNuevo = null;
    var datosPersonas = firebase.database().ref("Personas");

    //Validacion para consultar los datos de la persona seleccionada 
    //u obtener el ultimo idUsuario para agregar una nueva persona
    if("nuevo" != idPersonaRecuperado)
    {
        $scope.tituloUsuario="Editar datos del usuario";
        datosPersonas.on("child_added", function(data) {
            if(data.val().idUsuario==idPersonaRecuperado)
            {
                if(!JSON.parse($stateParams.esCliente))
                {
                    firebase.auth().signInWithEmailAndPassword(data.val().usuario, String(data.val().contrasenia)).then(function(snap) {
                        console.log("##### SE LOGEO EL USUARIO A EDITAR");
                    });
                }
                setTimeout(function(){
                    $scope.infoUsuario=data.val();
                    $scope.infoUsuario.fechaNacimiento= $scope.convertirFecha($scope.infoUsuario.fechaNacimiento);
                    $scope.tipoGenero=$scope.infoUsuario.genero;
                    $scope.usuarioOriginal = $scope.infoUsuario.usuario;
                    $scope.contraseniaOriginal = $scope.infoUsuario.contrasenia;
                    // $scope.infoUsuario.esCliente=$scope.infoUsuario.esCliente==1 ? true : false;
                    // console.log($scope.infoUsuario);
                    $scope.$apply();
                }, 1000);
            }
        });
    }
    else
    {
        $scope.tituloUsuario="Agregar nuevo usuario"
        datosPersonas.limitToLast(1).once("child_added", function (snapshot){
            $scope.idUsuarioNuevo = snapshot.val().idUsuario + 1;
            $scope.editarCorreoPass=true;
            // console.log("Ultimo id en la base de datos: "+$scope.idUsuarioNuevo);
        });
    }

    //Funcion para guardar una nueva persona o actualizar una persona existente 
    $scope.guardarDatos = function()
    {
        if("nuevo" == idPersonaRecuperado)
        {
            firebase.database().ref('Personas/' + $scope.idUsuarioNuevo).set({
                apellidos : $scope.infoUsuario.apellidos ,
                contrasenia : $scope.infoUsuario.contrasenia ,
                direccion : $scope.infoUsuario.direccion ,
                esCliente : 1 ,
                fechaNacimiento : $filter('date')($scope.infoUsuario.fechaNacimiento, 'yyyy-MM-dd') ,
                genero : $scope.tipoGenero ,
                idUsuario : $scope.idUsuarioNuevo ,
                nombre : $scope.infoUsuario.nombre ,
                telefono : $scope.infoUsuario.telefono ,
                usuario : $scope.infoUsuario.usuario
            }).then(function(data) {
                $scope.showAlert("Información","Los datos se guardaron correctamente.",true);
            }).catch(function(error) {
                $scope.showAlert("Error","Los datos no se guardaron correctamente.",true);
                console.log("XXXXX Error !!! "+ error);
            });
            
            firebase.auth().createUserWithEmailAndPassword($scope.infoUsuario.usuario, $scope.infoUsuario.contrasenia);
        }
        else
        {
            var datosActualizar = datosPersonas.child(idPersonaRecuperado);
            datosActualizar.update({
            	"apellidos" : $scope.infoUsuario.apellidos ,
                "contrasenia" : $scope.infoUsuario.contrasenia ,
                "direccion" : $scope.infoUsuario.direccion ,
                "fechaNacimiento" : $filter('date')($scope.infoUsuario.fechaNacimiento, 'yyyy-MM-dd') ,
                "genero" : $scope.tipoGenero ,
                "nombre" : $scope.infoUsuario.nombre ,
                "telefono" : $scope.infoUsuario.telefono ,
                "usuario" : $scope.infoUsuario.usuario
            }).then(function(data) {
                $scope.showAlert("Información","Los datos se actualizaron correctamente.",$scope.MenuAdmin);
            }).catch(function(error) {
                $scope.showAlert("Error","Los datos no se actualizaron correctamente.",$scope.MenuAdmin);
                console.log("XXXXX Error !!! "+ error);
            });


            if($scope.usuarioOriginal!=$scope.infoUsuario.usuario && $scope.contraseniaOriginal != $scope.infoUsuario.contrasenia)
            {
                var usuarioActivo = firebase.auth().currentUser;
                usuarioActivo.updateEmail($scope.infoUsuario.usuario).then(function() {
                    console.log("##### SE ACTUALIZO EL USUARIO");
                    usuarioActivo.updatePassword($scope.infoUsuario.contrasenia).then(function() {
                        console.log("##### SE ACTUALIZO LA CONTRASEÑA");
                        $scope.recuperarUsuario(true);
                    }, function(error) {
                        console.log("XXXXX NO SE ACTUALIZO LA CONTRASEÑA---"+error);
                    });
                }, function(error) {
                    console.log("XXXXX NO SE ACTUALIZO EL USUARIO---"+error);
                });
            }
            else if ($scope.usuarioOriginal!=$scope.infoUsuario.usuario)
            {
                var usuarioActivo = firebase.auth().currentUser;
                usuarioActivo.updateEmail($scope.infoUsuario.usuario).then(function() {
                    console.log("##### SE ACTUALIZO EL USUARIO");
                    $scope.recuperarUsuario(true);
                }, function(error) {
                    console.log("XXXXX NO SE ACTUALIZO EL USUARIO---"+error);
                });
            }
            else if($scope.contraseniaOriginal != $scope.infoUsuario.contrasenia)
            {
                var usuarioActivo = firebase.auth().currentUser;
                usuarioActivo.updatePassword($scope.infoUsuario.contrasenia).then(function() {
                    console.log("##### SE ACTUALIZO LA CONTRASEÑA");
                    $scope.recuperarUsuario(true);
                }, function(error) {
                    console.log("XXXXX NO SE ACTUALIZO LA CONTRASEÑA---"+error);
                });
            }
        }
    }
}]);
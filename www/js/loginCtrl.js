app.controller('loginCtrl', ['$scope', '$firebase', '$stateParams', function($scope, $firebase, $stateParams){
	
    console.log("entro al controlador del login");
    $scope.recuperarUsuario();
    $scope.validarUsu = {};
    $scope.mostrarValoresIncorrectos=false;
    var usuariosData = firebase.database().ref("Personas");
    if($stateParams.idUsuario != 0)
    {
        $scope.vistaBtnMenu(true);
    }

    //Funcion que valida el usuario que esta ingresando
    $scope.login=function(){
        $scope.VerificarUsuarioFireBase();
    }

    $scope.VerificarUsuarioFireBase = function(){
        firebase.auth().signInWithEmailAndPassword($scope.validarUsu.usuario, $scope.validarUsu.pass)
        .then(function(snap) {
            $scope.vistaBtnMenu(true);
            
            usuariosData.orderByChild("usuario").startAt($scope.validarUsu.usuario).endAt($scope.validarUsu.usuario).on("child_added", function(data) {
                console.log("se obtienen los datos");
                if(data.val().contrasenia==$scope.validarUsu.pass)
                {
                    setTimeout(function(){
                        console.log("El usuario es correcto.");
                        $scope.InicioSesion(data.val().nombre, data.val().genero, data.val().idUsuario, data.val().esCliente);
                        $scope.$apply();
                    }, 1000);
                }
            });
        })
        .catch(function(error) {
            $scope.showAlert("Error","El correo electronico o la contraseña son incorrectos.", false);
        });
    }

    $scope.VerificarUsuario = function(){
        
    }

    //Funcion para cerrar la sesion
    $scope.logout=function(){
        firebase.auth().signOut().then(function() {
            console.error('Se cerro sesion correctamente.');
            $scope.validarUsu = {};
            $scope.CerrarSesion();
        }, function(error) {
            console.error('Error al cerrar sesion: ', error);
        });
    }

}]);
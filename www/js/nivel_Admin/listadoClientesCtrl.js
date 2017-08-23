app.controller('listadoClientesCtrl', ['$scope', '$firebase','$stateParams','$ionicPopup', function($scope, $firebase,$stateParams,$ionicPopup){
	
    //Funciones de entrada
    console.log("##### Entro al controlador del listado usuarios");
    $scope.recuperarUsuario(true);
    $scope.vistaBtnMenu(true);

    //Declaracion de variables
    $scope.listaUsuarios = {};
    var listaUsuariosRef = firebase.database().ref("Personas");
    
    //Consulta los clientes existentes en la base de datos.
    listaUsuariosRef.on("value", function(snapshot) {
        var data =snapshot.toJSON();
        // $scope.listaUsuarios=data;
        for (var x in data) {
            if(data[x].idUsuario!=1)
            {
                $scope.listaUsuarios[x] = data[x];
            }
        }
        // console.log($scope.listaUsuarios);
    }, function (error) {
        console.log("XXXXX Error: " + error.code);
    });

    //Funcion para viajar a la pagina en donde se editara el usuario seleccionado.
    $scope.PagEditarUsuario= function(idPersona){
        window.location="#/guardarCliente/"+$scope.idUsuario+"/"+idPersona+"/"+false;
    }

    //Funcion para eliminar un Usuario.
    $scope.eliminarUsuario = function(usuarioSeleccionado)
    {
        var idPersona=usuarioSeleccionado.idUsuario;
        var usuarioEliminar=usuarioSeleccionado.usuario;
        var contraseniaEliminar=String(usuarioSeleccionado.contrasenia);

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmación',
            template: '¿Esta seguro de eliminar al usuario?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                listaUsuariosRef.child(idPersona).remove().then(function() {
                    $scope.showAlert("Información","Se borro el usuario seleccionado.",false);
                }).catch(function(error) {
                    $scope.showAlert("Error","No se pudo borrar el usuario seleccionado.",false);
                    console.log("XXXXX Error !!! "+ error);
                });
                firebase.auth().signInWithEmailAndPassword(usuarioEliminar, contraseniaEliminar)
                .then(function() {
                    var user = firebase.auth().currentUser;
                    user.delete().then(function() {
                        // console.log("---SE ELIMINO EL USUARIO AUTH DE FIREBASE---")
                        $scope.recuperarUsuario(true);
                    }, function(error) {
                        console.log("XXXXX NO SE ELIMINO EL USUARIO AUTH DE FIREBASE "+error);
                    });
                }).catch(function(error){
                    console.log("XXXXX ERROR AL ENTRAR AL USUARIO AUTH DE FIREBASE "+error);
                });
            } 
        });
    }
}]);
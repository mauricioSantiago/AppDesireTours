app.controller('listadoViajesCtrl', ['$scope', '$firebase', '$ionicPopup', function($scope, $firebase, $ionicPopup){

    //Funciones de entrada
    console.log("##### Entro al controlador del listado viajes");
    $scope.recuperarUsuario();
    $scope.vistaBtnMenu(true);

    //Declaracion de variables
    $scope.listaViajes = {};
    $scope.listaViajesComprados={};
    var listaViajesRef = firebase.database().ref("Viajes");
    var ViajesCompradosRef = firebase.database().ref("ViajesComprados");

    //Consulta los viajes existentes en la base de datos.
    listaViajesRef.on("value", function(snapshot) {
        var data =snapshot.toJSON();
        $scope.listaViajes=data;

        ViajesCompradosRef.on("value", function(dataRel) {
            var dataComprados =dataRel.toJSON();
            $scope.listaViajesComprados=dataComprados;

            for (var xViaje in $scope.listaViajes) {
                $scope.listaViajes[xViaje]["Comprado"]=false;
                for (var xCompra in $scope.listaViajesComprados) {
                    if($scope.listaViajes[xViaje].idViaje==$scope.listaViajesComprados[xCompra].idViaje){
                        $scope.listaViajes[xViaje].Comprado=true;
                        // console.log("--##ya se compro un boleto para "+$scope.listaViajes[xViaje].nombre);
                        break;
                    }
                }
            }
        });
    }, function (error) {
        console.log("XXXXX Error: " + error.code);
    });

    //Funcion para viajar a la pagina en donde se editara el viaje seleccionado.
    $scope.PagEditarViaje= function(viajeElegido){
        window.location="#/editarInfoViaje/"+$scope.idUsuario+"/"+viajeElegido.idViaje+"/"+viajeElegido.Comprado;
    }

    //Funcion para eliminar un viaje.
    $scope.eliminarViaje = function(viajeElegido)
    {
        var tituloPopup="";
        var textoPopup="";
        var idViaje = viajeElegido.idViaje;
        var estatusCompra = viajeElegido.Comprado;

        if(!estatusCompra)
        {
            tituloPopup="Confirmación";
            textoPopup="¿Esta seguro de eliminar el viaje?";
        }
        else
        {
            tituloPopup="Advertencia";
            textoPopup="Se eliminaran las compras existetes para este viaje."+
            " ¿Esta seguro de eliminarlo?";
        }
        var confirmPopup = $ionicPopup.confirm({
            title: tituloPopup,
            template: textoPopup
        });

        confirmPopup.then(function(res) {
            if(res) {

                if(estatusCompra)
                {
                    var relViajesPersonas = firebase.database().ref('ViajesComprados');
                    relViajesPersonas.orderByChild("idViaje").on('child_added', function(dataRel) {
                        if(dataRel.val().idViaje==idViaje){
                            // console.log("idViajeComprado eliminado: "+dataRel.val().idViajeComprado);
                            relViajesPersonas.child(dataRel.val().idViajeComprado).remove()
                        }
                    });
                }

                listaViajesRef.child(idViaje).remove().then(function() {
                    $scope.showAlert("Información","Se borro el viaje seleccionado.",false);
                }).catch(function(error) {
                    $scope.showAlert("Error","No se pudo borrar el viaje seleccionado.",false);
                    console.log("XXXXX Error !!! "+ error);
                });

            } 
        });
    }
}]);
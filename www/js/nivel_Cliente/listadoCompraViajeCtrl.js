app.controller('listadoCompraViajeCtrl', ['$scope', '$firebase', '$ionicPopup', function($scope, $firebase, $ionicPopup){

    //Funciones de entrada
    console.log("##### Entro al controlador del listado de compra de viajes");
    $scope.recuperarUsuario();
    $scope.vistaBtnMenu(true);

    //Declaracion de variables
    $scope.listaCompraViajes = [];
    $scope.viajesCompradosRel = {};
    var idViajeLista=0;
    var idViajeDeCompra=0;
    var totalCompraReserva=0;
    var totalLugares=0;
    var listaCompraViajesRef = firebase.database().ref("Viajes");
    var ViajesCompradosRef = firebase.database().ref("ViajesComprados");

    //Consulta los viajes existentes en la base de datos
    listaCompraViajesRef.on("value", function(snapshot) {
        data=snapshot.val();
        data.splice(1, 1);
        data.splice(0, 1);
        $scope.sortBy(data, { prop: "nombre" });
        $scope.listaCompraViajes=data;
        ViajesCompradosRef.orderByChild("idViaje").on('value', function(dataRel) {
            
            $scope.viajesCompradosRel=dataRel.val();
            for (var xViaje in $scope.listaCompraViajes ) {
            
                // console.log("##### IdViaje: "+ $scope.listaCompraViajes[xViaje].idViaje);
                idViajeLista = $scope.listaCompraViajes[xViaje].idViaje;
                totalLugares = $scope.listaCompraViajes[xViaje].numLugares;
                for (var xViajeCompra in $scope.viajesCompradosRel) {
                    
                    idViajeDeCompra=$scope.viajesCompradosRel[xViajeCompra].idViaje;
                    if(idViajeLista==idViajeDeCompra){
                        totalCompraReserva=$scope.viajesCompradosRel[xViajeCompra].boletosComprados+$scope.viajesCompradosRel[xViajeCompra].boletosReservados;
                        // console.log("##### Para el idViaje "+$scope.viajesCompradosRel[xViajeCompra].idViaje);
                        // console.log("Comprado: "+$scope.viajesCompradosRel[xViajeCompra].boletosComprados+" - Reservado: "+$scope.viajesCompradosRel[xViajeCompra].boletosReservados);
                    }
                }
                // console.log("totalBoletosComprados: "+totalCompraReserva);
                // console.log("totalLugares: "+$scope.listaCompraViajes[xViaje].numLugares);
                // console.log("Resultado: "+($scope.listaCompraViajes[xViaje].numLugares-totalCompraReserva));
                $scope.listaCompraViajes[xViaje]["LugaresDisponibles"] = (totalLugares - totalCompraReserva) == 0 ? false : true;

            }
        });
    }, function (error) {
        console.log("Error: " + error.code);
    });
}]);
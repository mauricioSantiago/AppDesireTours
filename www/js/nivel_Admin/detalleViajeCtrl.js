app.controller('detalleViajeCtrl', ['$scope', '$firebase', '$stateParams', function($scope, $firebase, $stateParams){

    //Funciones de entrada
    console.log("entro al controlador detalle del viaje");
    $scope.recuperarUsuario();
    $scope.obtenerlinkAtras("#/listadoViajes/");
    $scope.vistaBtnMenu(false);
    $scope.vistaBtnAtras(true);

    //Declaracion de variables
    $scope.ListaViajesComprados={};
    $scope.nombreViajeRecuperado = $stateParams.nombreViaje;
    var idViajeRecuperado= $stateParams.idViaje;
    $scope.estatusCompraRecuperado= JSON.parse($stateParams.estatusCompra);
    var relViajesPersonas = firebase.database().ref('ViajesComprados');
    var listaPersonas = firebase.database();
    
    if(!$scope.estatusCompraRecuperado)
    {
        $scope.showAlert("Información",'No se han comprado boletos para "'+$scope.nombreViajeRecuperado+'".',true);
    }

    //Consulta para cargar la tabla de detalle
    relViajesPersonas.orderByChild("idViaje").on('child_added', function(dataRel) {
        if(dataRel.val().idViaje==idViajeRecuperado){
            listaPersonas.ref('Personas/'+dataRel.val().idUsuario).on('value', function(dataPersonas){
                // console.log(dataRel.val());
                // console.log(dataPersonas.val());
                $scope.ListaViajesComprados[dataRel.val().idViajeComprado]={
                    "nombre": dataPersonas.val().nombre,
                    "apellidos": dataPersonas.val().apellidos,
                    "boletosComprados": dataRel.val().boletosComprados
                };
            });
        }
    });
}]);
app.controller('compraViajeCtrl', ['$scope', '$firebase','$stateParams','$filter', function($scope, $firebase,$stateParams,$filter){
	
    console.log("entro al controlador de comprar viaje");
    //Funciones de entrada
    $scope.vistaBtnMenu(false);
    $scope.vistaBtnAtras(true);
    $scope.recuperarUsuario();
    $scope.obtenerlinkAtras("#/listadoCompraViaje/");

    //Declaracion de variables
    
    $scope.viajesComprados = {};
    $scope.viajeElegido = {};
    $scope.idNuevoViajeComprado = 0;
    $scope.idViajeComprado = 0;
    $scope.existeCompra=false;
    $scope.boletosComprados=0;
    var idViajeRecuperado= $stateParams.idViaje;
    var dataViajesComprados = firebase.database().ref("ViajesComprados");
    var dataListadoViajesComprados = firebase.database().ref("Viajes");

    dataViajesComprados.on("child_added", function(data) {
        if(data.val().idViaje==idViajeRecuperado )
        {
            $scope.boletosComprados = $scope.boletosComprados+data.val().boletosComprados;
            // console.log("#####CANTIDAD DE BOLETOS COMPRADOS: "+$scope.boletosComprados);
        }
    });

    dataListadoViajesComprados.on("child_added", function(data) {
        if(data.val().idViaje == idViajeRecuperado)
        {
            $scope.viajeElegido={
                "costoRsva":data.val().costoRsva ,
                "costoTotal":data.val().costoTotal ,
                "fechaFin": data.val().fechaFin,
                "fechaInicio": data.val().fechaInicio ,
                "nombre": data.val().nombre ,
                "numLugares":(data.val().numLugares)
            }
        }
    });

    dataViajesComprados.limitToLast(1).once("child_added", function (snapshot){
        $scope.idNuevoViajeComprado = snapshot.val().idViajeComprado + 1;
        // console.log("##### ULTIMO VIAJE COMPRADO: "+ $scope.idNuevoViajeComprado);
    });

    dataViajesComprados.on("child_added", function(data) {
        if(data.val().idViaje==idViajeRecuperado &&
           data.val().idUsuario==$scope.idUsuario )
        {
            $scope.idViajeComprado = data.val().idViajeComprado;
            $scope.existeCompra=true;
            // console.log("#####SE ENCONTRO UNA COMPRA EXISTENTE: "+$scope.idViajeComprado);
        }
    });

    
    //Funcion para guardar una nueva persona o actualizar una persona existente 
    $scope.viajeCompra_Reserva = function(esCompra)
    {
        console.log("##### idViajeComprado existente: "+$scope.idViajeComprado);
        console.log("##### idNuevoViajeComprado existente: "+$scope.idNuevoViajeComprado);
        if(esCompra)
        {
            console.log("##### cantidad de lugares comprados "+viajesComprados.numLugares);
        }
        else
        {
            console.log("##### cantidad de lugares reservados "+viajesComprados.numLugares);
        }
        // if(!$scope.existeCompra)
        // {
        //     var boletoCopramdo = 0;
        //     var boletoReservado = 0;
        //     var mensajeCompra = "";

        //     if(esCompra)
        //     {
        //         boletoComprado = viajesComprados.numLugares;
        //         mensajeCompra = "Compra existosa.";
        //     }
        //     else
        //     {
        //         boletoReservado = viajesComprados.numLugares;
        //         mensajeCompra = "Se ha reservado existosamente.";
        //     }

        //     firebase.database().ref('ViajesComprados/' + $scope.idNuevoViajeComprado).set({
        //         boletosComprados : boletoComprado ,
        //         boletosReservados : boletoReservado ,
        //         idUsuario : $scope.idUsuario ,
        //         idViaje : idViajeRecuperado ,
        //         idViajeComprado : $scope.idNuevoViajeComprado
        //     }).then(function(data) {
        //         $scope.showAlert("Información", mensajeCompra, true);
        //     }).catch(function(error) {
        //         $scope.showAlert("Error","No se realizo correctamente la transaccion.");
        //         console.log("error !!! "+ error);
        //     });
            
        //     firebase.auth().createUserWithEmailAndPassword($scope.infoUsuario.usuario, $scope.infoUsuario.contrasenia);
        // }
        // else
        // {
        //     var datosActualizar = dataViajesComprados.child($scope.idViajeComprado);
            
        //     if(esCompra)
        //     {
        //         datosActualizar.update({
        //         	"boletosComprados" : $scope.infoUsuario.apellidos 
        //         }).then(function(data) {
        //             $scope.showAlert("Información","Compra existosa.",true);
        //         }).catch(function(error) {
        //             $scope.showAlert("Error","No se realizo correctamente la transaccion.",true);
        //             console.log("error !!! "+ error);
        //         });
        //     }
        //     else
        //     {
        //         datosActualizar.update({
        //             "boletosReservados" : $scope.infoUsuario.apellidos 
        //         }).then(function(data) {
        //             $scope.showAlert("Información","Se ha reservado existosamente.",true);
        //         }).catch(function(error) {
        //             $scope.showAlert("Error","No se realizo correctamente la transaccion.",true);
        //             console.log("error !!! "+ error);
        //         });
        //     }
        // }
    }
}]);
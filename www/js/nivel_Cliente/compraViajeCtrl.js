app.controller('compraViajeCtrl', ['$scope', '$firebase','$stateParams','$filter', function($scope, $firebase,$stateParams,$filter){
	
    console.log("##### Entro al controlador de comprar viaje");
    
    //Funciones de entrada
    $scope.vistaBtnMenu(false);
    $scope.vistaBtnAtras(true);
    $scope.recuperarUsuario();
    $scope.obtenerlinkAtras("#/listadoCompraViaje/");

    //Declaracion de variables
    $scope.viajesComprados = {};
    $scope.viajeElegido = {};
    $scope.idNuevoViajeComprado = 0;
    $scope.esCompra=true;
    $scope.idViajeComprado = 0;
    $scope.existeCompra=false;
    $scope.boletosComprados=0;
    $scope.boletosCompradosExistentes=0;
    $scope.boletosReservadosExistentes=0;
    $scope.lugaresSuficientes=JSON.parse($stateParams.Disponibilidad);
    var idViajeRecuperado= $stateParams.idViaje;
    var idUsuarioRecuperado= $stateParams.idUsuario;
    var dataViajesComprados = firebase.database().ref("ViajesComprados");
    var dataListadoViajesComprados = firebase.database().ref("Viajes");

    //Se obtiene el total de boletos comprados y reservados que tenga, el viaje seleccionado.
    dataViajesComprados.on("child_added", function(data) {
        if(data.val().idViaje==idViajeRecuperado )
        {
            $scope.boletosComprados = $scope.boletosComprados+data.val().boletosComprados+data.val().boletosReservados;
            // console.log("##### CANTIDAD DE BOLETOS COMPRADOS: "+$scope.boletosComprados);
        }
    });

    //Se obtiene la información del viaje seleccionado.
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
            // console.log("##### Se obtuvieron los datos del viaje");
        }
    });

    //Si no existe una compra hecha por el usuario se le creea un nuevo idViajeComprado.
    dataViajesComprados.limitToLast(1).once("child_added", function (snapshot){
        $scope.idNuevoViajeComprado = snapshot.val().idViajeComprado + 1;
        // console.log("##### ULTIMO VIAJE COMPRADO: "+ $scope.idNuevoViajeComprado);
    });

    //Se busca si el cliente tiene alguna compra o reserva de boletos para el viaje seleccionado.
    dataViajesComprados.on("child_added", function(data) {
        if(data.val().idViaje==idViajeRecuperado &&
           data.val().idUsuario==idUsuarioRecuperado )
        {
            $scope.idViajeComprado = data.val().idViajeComprado;
            $scope.boletosCompradosExistentes=data.val().boletosComprados;
            $scope.boletosReservadosExistentes=data.val().boletosReservados;
            $scope.existeCompra=true;
            // console.log("##### SE ENCONTRO UNA COMPRA EXISTENTE: "+$scope.idViajeComprado);   
        }
    });

    //Funcion para validar si se esta comprando el boleto o se esta reservando el viaje.
    $scope.darValidacion = function(valor)
    {
        $scope.esCompra=valor;
    }

    //Funcion para guardar una nueva compra o actualizar una compra existente.
    $scope.viajeCompra_Reserva = function()
    {
        if(!$scope.existeCompra)
        {
            var boletoComprado = 0;
            var boletoReservado = 0;
            var mensajeCompra = "";

            if($scope.esCompra)
            {
                boletoComprado = $scope.viajesComprados.numLugares;
                mensajeCompra = "Compra existosa.";
            }
            else
            {
                boletoReservado = $scope.viajesComprados.numLugares;
                mensajeCompra = "Se ha reservado existosamente.";
            }

            firebase.database().ref('ViajesComprados/' + $scope.idNuevoViajeComprado).set({
                boletosComprados : boletoComprado ,
                boletosReservados : boletoReservado ,
                idUsuario : idUsuarioRecuperado ,
                idViaje : idViajeRecuperado ,
                idViajeComprado : $scope.idNuevoViajeComprado
            }).then(function(data) {
                $scope.showAlert("Información", mensajeCompra, true);
            }).catch(function(error) {
                $scope.showAlert("Error","No se realizo correctamente la transaccion.",false);
                console.log("error !!! "+ error);
            });
        }
        else
        {
            var datosActualizar = dataViajesComprados.child($scope.idViajeComprado);
            
            if($scope.esCompra)
            {
                datosActualizar.update({
                	"boletosComprados" : ($scope.viajesComprados.numLugares+$scope.boletosCompradosExistentes)
                }).then(function(data) {
                    $scope.showAlert("Información","Compra existosa.",true);
                }).catch(function(error) {
                    $scope.showAlert("Error","No se realizo correctamente la transaccion.", false);
                    console.log("error !!! "+ error);
                });
            }
            else
            {
                datosActualizar.update({
                    "boletosReservados" : ($scope.viajesComprados.numLugares+$scope.boletosReservadosExistentes)
                }).then(function(data) {
                    $scope.showAlert("Información","Se ha reservado existosamente.",true);
                }).catch(function(error) {
                    $scope.showAlert("Error","No se realizo correctamente la transaccion.",false);
                    console.log("error !!! "+ error);
                });
            }
        }
    }
}]);
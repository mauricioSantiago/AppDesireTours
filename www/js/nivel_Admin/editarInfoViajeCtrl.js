app.controller('editarInfoViajeCtrl', ['$scope', '$firebase','$stateParams','$filter', function($scope, $firebase, $stateParams, $filter){
    
    //Funciones de entrada
    $scope.vistaBtnMenu(false);
    $scope.vistaBtnAtras(true);
    $scope.recuperarUsuario();
    $scope.obtenerlinkAtras("#/listadoViajes/");

    //Declaracion de variables
    $scope.listaViajes = {};
    $scope.tituloViaje = null;
    var idViajeRecuperado= $stateParams.idViaje;
    $scope.idViajeNuevo = null;
    var datosViaje = firebase.database().ref("Viajes");

    //Validacion para consultar los datos del viaje seleccionado 
    //u obtener el ultimo idViaje para agregar uno nuevo
    if("nuevo" != idViajeRecuperado)
    {
        $scope.tituloViaje="Editar viaje";
        datosViaje.on("child_added", function(data) {
            if(data.val().idViaje==idViajeRecuperado)
            {
                setTimeout(function(){
                    $scope.listaViajes=data.val();
                    $scope.listaViajes.fechaInicio= $scope.convertirFecha($scope.listaViajes.fechaInicio);
                    $scope.listaViajes.fechaFin= $scope.convertirFecha($scope.listaViajes.fechaFin);
                    // console.log($scope.listaViajes);
                    $scope.$apply();
                }, 1000);
            }
        });
    }
    else
    {
        $scope.tituloViaje="Agregar nuevo viaje"
        datosViaje.limitToLast(1).once("child_added", function (snapshot){
            $scope.idViajeNuevo = snapshot.val().idViaje;
        });
        $scope.idViajeNuevo=$scope.idViajeNuevo+1;
        // console.log("Ultimo id en la base de datos: "+$scope.idViajeNuevo);
    }

    //Funcion para guardar un nuevo viaje o actualizar un viaje existente 
    $scope.guardarDatos = function()
    {
        if("nuevo" == idViajeRecuperado)
        {
            firebase.database().ref('Viajes/' + $scope.idViajeNuevo).set({
                costoRsva : $scope.listaViajes.costoRsva ,
                costoTotal : $scope.listaViajes.costoTotal ,
                fechaFin : $filter('date')($scope.listaViajes.fechaFin, 'yyyy-MM-dd') ,
                fechaInicio : $filter('date')($scope.listaViajes.fechaInicio, 'yyyy-MM-dd') ,
                nombre : $scope.listaViajes.nombre ,
                numLugares : $scope.listaViajes.numLugares,
                idViaje : $scope.idViajeNuevo
            }).then(function(data) {
                $scope.showAlert("Información","Los datos se guardaron correctamente.",true);
            }).catch(function(error) {
                $scope.showAlert("Error","Los datos no se guardaron correctamente.",true);
                console.log("error !!! "+ error);
            });
        }
        else
        {
            var datosActualizar = datosViaje.child(idViajeRecuperado);
            datosActualizar.update({
              "costoRsva":$scope.listaViajes.costoRsva ,
              "costoTotal":$scope.listaViajes.costoTotal ,
              "fechaFin": $filter('date')($scope.listaViajes.fechaFin, 'yyyy-MM-dd') ,
              "fechaInicio": $filter('date')($scope.listaViajes.fechaInicio, 'yyyy-MM-dd') ,
              "nombre": $scope.listaViajes.nombre ,
              "numLugares":$scope.listaViajes.numLugares
            }).then(function(data) {
                $scope.showAlert("Información","Los datos se actualizaron correctamente.",true);
            }).catch(function(error) {
                $scope.showAlert("Error","Los datos no se actualizaron correctamente.",true);
                console.log("error !!! "+ error);
            });
        }
    }
}]);
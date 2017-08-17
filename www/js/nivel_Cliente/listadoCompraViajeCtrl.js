app.controller('listadoCompraViajeCtrl', ['$scope', '$firebase', '$ionicPopup', function($scope, $firebase, $ionicPopup){

    //Funciones de entrada
    console.log("entro al controlador del listado de compra de viajes");
    $scope.recuperarUsuario();
    $scope.vistaBtnMenu(true);

    //Declaracion de variables
    $scope.listaCompraViajes = [];
    var listaCompraViajesRef = firebase.database().ref("Viajes");

    //Consulta los viajes existentes en la base de datos
    listaCompraViajesRef.on("value", function(snapshot) {
        data=snapshot.val();
        data.splice(1, 1);
        data.splice(0, 1);
        $scope.sortBy(data, { prop: "nombre" });
        $scope.listaCompraViajes=data;

    }, function (error) {
        console.log("Error: " + error.code);
    });
}]);
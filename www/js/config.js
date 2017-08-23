app.config(function($stateProvider){

	$stateProvider
		.state(' ', {
                url: '',
                views: {
                    'menuContent': {
                        templateUrl: 'paginas/login.html',
                        controller: 'loginCtrl'
                    }}
            })
        .state('login', {
                url: '/login/:idUsuario',
                views: {
					'menuContent': {
						templateUrl: 'paginas/login.html',
                		controller: 'loginCtrl'
					}
				}
            })
        .state('guardarCliente', {
                url: '/guardarCliente/:idUsuario/:idPersona/:esCliente',
                views: {
                    'menuContent': {
                        templateUrl: 'paginas/guardarCliente.html',
                        controller: 'guardarClienteCtrl'
                    }
                }
            })
        .state('listadoViajes', {
                url: '/listadoViajes/:idUsuario',
                views: {
                    'menuContent': {
                        templateUrl: 'paginas/nivel_Admin/listadoViajes.html',
                        controller: 'listadoViajesCtrl'
                    }
                }
            })
        .state('editarInfoViaje', {
                url: '/editarInfoViaje/:idUsuario/:idViaje/:estatusCompra',
                views: {
                    'menuContent': {
                        templateUrl: 'paginas/nivel_Admin/editarInfoViaje.html',
                        controller: 'editarInfoViajeCtrl'
                    }
                }
            })
        .state('detalleViaje', {
                url: '/detalleViaje/:idUsuario/:nombreViaje/:idViaje/:estatusCompra',
                views: {
                    'menuContent': {
                        templateUrl: 'paginas/nivel_Admin/detalleViaje.html',
                        controller: 'detalleViajeCtrl'
                    }
                }
            })
        .state('listadoClientes', {
                url: '/listadoClientes/:idUsuario',
                views: {
                    'menuContent': {
                        templateUrl: 'paginas/nivel_Admin/listadoClientes.html',
                        controller: 'listadoClientesCtrl'
                    }
                }
            })
        .state('compraViaje', {
                url: '/compraViaje/:idUsuario/:idViaje/:Disponibilidad',
                views: {
                    'menuContent': {
                        templateUrl: 'paginas/nivel_Cliente/compraViaje.html',
                        controller: 'compraViajeCtrl'
                    }
                }
            })
        .state('listadoCompraViaje', {
                url: '/listadoCompraViaje/:idUsuario',
                views: {
                    'menuContent': {
                        templateUrl: 'paginas/nivel_Cliente/listadoCompraViaje.html',
                        controller: 'listadoCompraViajeCtrl'
                    }
                }
            });
});
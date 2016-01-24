/** @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
  $stateProvider
    .state('app', {
        url: '/',
        template: temp('abrisApp')
    })
    .state('app.home', {
        url: 'home',
        template: temp('abrisHome')
    });

  $urlRouterProvider.otherwise('/');
}


function temp(name: string): string {
    var componentName = name.replace(/\.?([A-Z])/g, function (x: string, y: string){return '-' + y.toLowerCase(); }).replace(/^_/, '');
    return '<' + componentName + '></' + componentName + '>';
}
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
    })
    .state('app.schedule', {
        url: 'schedule/:seasonId',
        template: temp('abrisEvents')
    })
    .state('app.competitions', {
        url: 'schedule/:seasonId/competitions/:eventId',
        template: temp('abrisCompetitions')
    })
    .state('app.results', {
        url: 'schedule/:seasonId/competitions/:eventId/results/:raceId',
        template: temp('abrisResults')
    })
    .state('app.cups', {
        url: 'cups',
        template: temp('abrisCups')
    })
    .state('app.athletes', {
        url: 'athletes',
        template: temp('abrisAthletes')
    })
    .state('app.stats', {
        url: 'stats',
        template: temp('abrisStats')
    });

  $urlRouterProvider.otherwise('/');
}


function temp(name: string): string {
    var componentName = name.replace(/\.?([A-Z])/g, function (x: string, y: string){return '-' + y.toLowerCase(); }).replace(/^_/, '');
    return '<' + componentName + '></' + componentName + '>';
}
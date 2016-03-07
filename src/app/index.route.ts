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
    .state('app.eventRankingResults', {
        url: 'schedule/:seasonId/competitions/:eventId/eventrankingresults/:category',
        template: temp('abrisEventRankingResults')
    })
    .state('app.cups', {
        url: 'cups/:seasonId',
        template: temp('abrisCups')
    })
    .state('app.cupresults', {
        url: 'cupresults/:seasonId/:cupId',
        template: temp('abrisCupResults')
    })
    .state('app.athletes', {
        url: 'athletes',
        template: temp('abrisAthletes')
    })
    .state('app.stats', {
        url: 'stats/:seasonId',
        template: temp('abrisStatistics')
    })
    .state('app.statisticDefault', {
        url: 'stat-default/:statisticId/:seasonId',
        template: temp('abrisStatisticDefault')
    });

  $urlRouterProvider.otherwise('/');
}


function temp(name: string): string {
    var componentName = name.replace(/\.?([A-Z])/g, function (x: string, y: string){return '-' + y.toLowerCase(); }).replace(/^_/, '');
    return '<' + componentName + '></' + componentName + '>';
}
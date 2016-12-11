/** @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
  $stateProvider
    .state('app', {
        url: '/',
        template: component('abrisApp')
    })
    .state('app.home', {
        url: 'home',
        template: component('abrisHome')
    })
    .state('app.schedule', {
        url: 'schedule/:seasonId',
        template: component('abrisEvents')
    })
    .state('app.competitions', {
        url: 'schedule/:seasonId/competitions/:eventId',
        template: component('abrisCompetitions')
    })
    .state('app.results', {
        url: 'schedule/:seasonId/competitions/:eventId/results/:raceId',
        template: component('abrisResults')
    })
    .state('app.eventRankingResults', {
        url: 'schedule/:seasonId/competitions/:eventId/eventrankingresults/:category',
        template: component('abrisEventRankingResults')
    })
    .state('app.cups', {
        url: 'cups/:seasonId',
        template: component('abrisCups')
    })
    .state('app.cupresults', {
        url: 'cupresults/:seasonId/:cupId',
        template: component('abrisCupResults')
    })
    .state('app.athletes', {
        url: 'athletes',
        template: component('abrisAthletes')
    })
    .state('app.stats', {
        url: 'stats/:seasonId',
        template: component('abrisStatistics')
    })
    .state('app.statisticDefault', {
        url: 'stat-default/:statisticId/:seasonId',
        template: component('abrisStatisticDefault')
        template: temp('abrisStatisticDefault')
    })
    .state('app.about', {
        url: 'about',
        template: temp('abrisAbout')
    });

  $urlRouterProvider.otherwise('/');
}


function component(name: string): string {
    var componentName = name.replace(/\.?([A-Z])/g, function (x: string, y: string){return '-' + y.toLowerCase(); }).replace(/^_/, '');
    return '<' + componentName + '></' + componentName + '>';
}
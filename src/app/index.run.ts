import {
    Analysis,
    Athletes, 
    Competitions, 
    Bios,
    CupResults,
    Cups,
    Events,
    FactItems,
    Organizers,
    Results,
    Seasons,
    StatItems,
    Stats} from './services/services';
    
/** @ngInject */
export function runBlock(
    $log: angular.ILogService, 
    Restangular: restangular.IService,
    Analysis: Analysis,
    Athletes: Athletes,
    Competitions: Competitions,
    Bios: Bios,
    CupResults,
    Cups,
    Events,
    FactItems,
    Organizers,
    Results,
    Seasons,
    StatItems,
    Stats,
    $translate: any
    ) {
    
    Restangular.setBaseUrl('http://datacenter.biathlonresults.com/modules/sportapi/api/');
    Restangular.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK', RT: 385698, RequestId: 1});
    Restangular.setJsonp(true);
    
    Restangular.addResponseInterceptor(function(data: any, operation: any, what: any, url: any, response: any, deferred: any) {
        var extractedData;

        var endpoint = url.substring(url.indexOf('/api/') + 5);
        
        if (operation === "getList") {
            switch(endpoint) {
                case Analysis.Entity:
                    extractedData = Analysis.transformResponse(data, response);
                    break;
                case Athletes.Entity:
                    extractedData = Athletes.transformResponse(data, response);
                    break;
                case Bios.Entity: 
                    extractedData = Bios.transformResponse(data, response);
                    break;
                case Competitions.Entity:
                    extractedData = Competitions.transformResponse(data, response);
                    break;
                case CupResults.Entity:
                    extractedData = CupResults.transformResponse(data, response);
                    break;
                case Cups.Entity:
                    extractedData = Cups.transformResponse(data, response);
                    break;
                case Events.Entity:
                    extractedData = Events.transformResponse(data, response);
                    break;
                case FactItems.Entity:
                    extractedData = FactItems.transformResponse(data, response);
                    break;
                case Organizers.Entity:
                    extractedData = Organizers.transformResponse(data, response);
                    break;
                case Results.Entity:
                    extractedData = Results.transformResponse(data, response);
                    break;
                case Seasons.Entity:
                    extractedData = Seasons.transformResponse(data, response);
                    break;
                case StatItems.Entity:
                    extractedData = StatItems.transformResponse(data, response);
                    break;
                case Stats.Entity:
                    extractedData = Stats.transformResponse(data, response);
                    break;
                default:
                    extractedData = data;
            }
        } 
        else {
            extractedData = data.data;
        }
        
        return extractedData;
    });
    
    var langKey = localStorage.getItem('langKey');
    if (langKey) {
        $translate.use(langKey);
    }
}
import {Athletes, Competitions, Bios, FactCategories, StatCategoriesService} from './services/services'

/** @ngInject */
export function runBlock(
    $log: angular.ILogService, 
    Restangular: restangular.IService,
    Athletes: Athletes,
    Competitions: Competitions,
    Bios: Bios) {
    
    Restangular.setBaseUrl('http://datacenter.biathlonresults.com/modules/sportapi/api/');
    Restangular.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK', RT: 385698, RequestId: 1});
    Restangular.setJsonp(true);
    
    Restangular.addResponseInterceptor(function(data: any, operation: any, what: any, url: any, response: any, deferred: any) {
        var extractedData;

        var endpoint = url.substring(url.indexOf('/api/') + 5);
        
        if (operation === "getList") {
            switch(endpoint) {
                case Athletes.Entity:
                    extractedData = data.Athletes;
                    break;
                case "cupresults":
                    extractedData = data.Rows;
                    break;
                case Bios.Entity: 
                    extractedData = data.Bios;
                    break;
                case Competitions.Entity:
                    extractedData = data;
                default:
                    extractedData = data;
            }
        } 
        else {
            extractedData = data.data;
        }
        
        return extractedData;
    });
    
    $log.debug('runBlock end');
}
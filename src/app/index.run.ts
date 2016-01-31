/** @ngInject */
export function runBlock($log: angular.ILogService, Restangular: restangular.IService) {
    
    Restangular.setBaseUrl('http://datacenter.biathlonresults.com/modules/sportapi/api/');
    Restangular.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
    Restangular.setJsonp(true);
    
    Restangular.addResponseInterceptor(function(data: any, operation: any, what: any, url: any, response: any, deferred: any) {
        var extractedData;

        var endpoint = url.substring(url.indexOf('/api/') + 5);
        
        if (operation === "getList") {
            switch(endpoint) {
                case "athletes":
                    extractedData = data.Athletes;
                    break;
                case "cupresults":
                    extractedData = data.Rows;
                    break;
                case "bios": 
                    
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

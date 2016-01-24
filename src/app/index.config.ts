/** @ngInject */
export function config(
    $logProvider: angular.ILogProvider, 
    toastrConfig: any,
    RestangularProvider: restangular.IProvider) {
    // enable log
    $logProvider.debugEnabled(true);
    // set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    RestangularProvider.setBaseUrl('http://datacenter.biathlonresults.com/modules/sportapi/api/');
    RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
    RestangularProvider.setJsonp(true);
    
    RestangularProvider.addResponseInterceptor(function(data: any, operation: any, what: any, url: any, response: any, deferred: any) {
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
}

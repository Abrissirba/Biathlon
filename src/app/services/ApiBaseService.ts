import { ApiServiceHelper } from './ApiServiceHelper'

export class ApiBaseService {
    Service: restangular.IElement;
    
    constructor(
        private entity: string,
        transformFn: (data, response) => Array<any>,
        private Restangular: restangular.IService){
        
        this.addInterceptor(this.entity, transformFn);
        
        this.Service = this.getService(this.entity);
        
    }
    
    get get() : (queryParams?: any, headers?: any) => restangular.IPromise<any> {
        return this.Service.get;
    }

    get getList() : (subElement?: any, queryParams?: any, headers?: any) => restangular.ICollectionPromise<any>{
        return this.Service.getList;
    }

    getService(entity){
        return this.Restangular.all(entity);
    }
    
    addInterceptor(entity, transformFn) {
        this.Restangular.addResponseInterceptor((data: any, operation: any, what: any, url: any, response: any, deferred: any) => {
            if(operation === "getList" && this.isEntity(url, entity)){
                return transformFn(data, response);
            }
        });
    }
    
    isEntity(url, entity){
        return url.substring(url.indexOf('/api/') + 5) === entity;
    }
}

export class ApiBaseService <T>{
    Service: restangular.IElement;
    
    constructor(
        public Entity: string,
        transformFn: (data, response) => Array<T>,
        private Restangular: restangular.IService){
                
        this.Service = this.getService(this.Entity);
        
    }

    getService(entity){
        return this.Restangular.all(entity);
    }
    
    isEntity(url, entity){
        return url.substring(url.indexOf('/api/') + 5) === entity;
    }
}

import { ApiBaseService } from './ApiBaseService'
import { ISeason } from '../models/models'

/** @ngInject */
export class Seasons extends ApiBaseService<ISeason>{
    
    constructor(Restangular: restangular.IService){
        super("seasons", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(): restangular.ICollectionPromise<ISeason>{
        return this.Service.withHttpConfig({cache: true}).getList<ISeason>();
    }
}

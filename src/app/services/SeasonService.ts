import { ApiBaseService } from './ApiBaseService'
import { ISeason } from '../models/models'

export class Seasons extends ApiBaseService<ISeason>{
    
    constructor(Restangular: restangular.IService){
        super("seasons", this.transformResponse, Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(raceId: string): restangular.ICollectionPromise<ISeason>{
        return this.Service.getList<ISeason>();
    }
}

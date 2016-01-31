import { ApiBaseService } from './ApiBaseService'
import { IStat, IStatQuery } from '../models/models'

export class Stats extends ApiBaseService<IStat>{
    
    constructor(Restangular: restangular.IService){
        super("stats", this.transformResponse, Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data.Rows;
    }

    getList(statQuery: IStatQuery): restangular.ICollectionPromise<IStat>{
        return this.Service.getList<IStat>(statQuery);
    }
}

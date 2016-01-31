import { ApiBaseService } from './ApiBaseService'
import { ICupResult } from '../models/models'

export class CupResults extends ApiBaseService<ICupResult>{
    
    constructor(Restangular: restangular.IService){
        super("cupresults", this.transformResponse, Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data.Rows;
    }

    getList(cupId: string): restangular.ICollectionPromise<ICupResult>{
        return this.Service.getList<ICupResult>({
            CupId: cupId
        });
    }
}

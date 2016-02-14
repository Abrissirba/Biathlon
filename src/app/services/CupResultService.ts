import { ApiBaseService } from './ApiBaseService'
import { ICupResult } from '../models/models'

/** @ngInject */
export class CupResults extends ApiBaseService<ICupResult>{
    
    constructor(Restangular: restangular.IService){
        super("cupresults", Restangular);
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

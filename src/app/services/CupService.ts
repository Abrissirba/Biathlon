import { ApiBaseService } from './ApiBaseService'
import { ICup } from '../models/models'

export class Cups extends ApiBaseService<ICup>{
    
    constructor(Restangular: restangular.IService){
        super("cups", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(seasonId: string): restangular.ICollectionPromise<ICup>{
        return this.Service.getList<ICup>({
            SeasonId: seasonId
        });
    }
}

import { ApiBaseService } from './ApiBaseService'
import { IStatItem } from '../models/models'

export class StatItems extends ApiBaseService<IStatItem>{
    
    constructor(Restangular: restangular.IService){
        super("statitems", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(): restangular.ICollectionPromise<IStatItem>{
        return this.Service.getList<IStatItem>({
            Availability: 2
        });
    }
}

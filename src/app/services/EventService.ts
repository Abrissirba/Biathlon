import { ApiBaseService } from './ApiBaseService'
import { IEvent } from '../models/models'

export class Events extends ApiBaseService<IEvent>{
    
    constructor(Restangular: restangular.IService){
        super("events", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(seasonId: string): restangular.ICollectionPromise<IEvent>{
        return this.Service.getList<IEvent>({
            SeasonId: seasonId,
            level: 0
        });
    }
}

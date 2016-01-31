import { ApiBaseService } from './ApiBaseService'
import { ICompetition } from '../models/models'

export class Competitions extends ApiBaseService<ICompetition>{
    
    constructor(Restangular: restangular.IService){
        super("competitions", this.transformResponse, Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(eventId: string): restangular.ICollectionPromise<ICompetition>{
        return this.Service.getList<ICompetition>({
            eventId: eventId
        });
    }
}

import { ApiBaseService } from './ApiBaseService'
import { ICompetition } from '../models/models'

/** @ngInject */
export class Competitions extends ApiBaseService<ICompetition>{
    
    constructor(Restangular: restangular.IService){
        super("competitions", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(eventId: string): restangular.ICollectionPromise<ICompetition>{
        return this.Service.withHttpConfig({cache: true}).getList<ICompetition>({
            eventId: eventId
        });
    }
}

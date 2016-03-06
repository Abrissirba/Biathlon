import { ApiBaseService } from './ApiBaseService'
import { IStat, IStatQuery } from '../models/models'

/** @ngInject */
export class Stats extends ApiBaseService<IStat>{
    
    constructor(Restangular: restangular.IService){
        super("stats", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data.Rows;
    }

    getList(statQuery: IStatQuery): restangular.ICollectionPromise<IStat>{
        statQuery.nat = statQuery.nat || '';
        statQuery.ibuId = statQuery.ibuId || '';
        statQuery.organizerId = statQuery.organizerId || '';
        statQuery.seasonId = statQuery.seasonId || '';
        statQuery.byWhat = statQuery.byWhat || 'ATH';
        statQuery.genderId = statQuery.genderId || '';
        return this.Service.withHttpConfig({cache: true}).getList<IStat>(statQuery);
    }
}

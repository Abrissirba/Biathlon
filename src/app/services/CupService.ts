import { ApiBaseService } from './ApiBaseService'
import { ICup } from '../models/models'

/** @ngInject */
export class Cups extends ApiBaseService<ICup>{
    
    constructor(Restangular: restangular.IService){
        super("cups", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(seasonId: string): restangular.ICollectionPromise<ICup>{
        return this.Service.withHttpConfig({cache: true}).getList<ICup>({
            SeasonId: seasonId
        });
    }
}

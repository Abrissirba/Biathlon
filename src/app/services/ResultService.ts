import { ApiBaseService } from './ApiBaseService'
import { IResult } from '../models/models'

export class Results extends ApiBaseService<IResult>{
    
    constructor(Restangular: restangular.IService){
        super("results", this.transformResponse, Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data.Results;
    }

    getList(raceId: string): restangular.ICollectionPromise<IResult>{
        return this.Service.getList<IResult>({
            RaceId: raceId
        });
    }
}

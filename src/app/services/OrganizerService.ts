import { ApiBaseService } from './ApiBaseService'
import { IOrganizer } from '../models/models'

export class Organizers extends ApiBaseService<IOrganizer>{
    
    constructor(Restangular: restangular.IService){
        super("organizers", this.transformResponse, Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(): restangular.ICollectionPromise<IOrganizer>{
        return this.Service.getList<IOrganizer>();
    }
}

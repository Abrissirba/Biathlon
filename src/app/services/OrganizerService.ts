import { ApiBaseService } from './ApiBaseService'
import { IOrganizer } from '../models/models'

/** @ngInject */
export class Organizers extends ApiBaseService<IOrganizer>{
    
    constructor(Restangular: restangular.IService){
        super("organizers", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(): restangular.ICollectionPromise<IOrganizer>{
        return this.Service.withHttpConfig({cache: true}).getList<IOrganizer>();
    }
}

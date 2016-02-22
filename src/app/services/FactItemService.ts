import { ApiBaseService } from './ApiBaseService'
import { IFactItem } from '../models/models'

/** @ngInject */
export class FactItems extends ApiBaseService<IFactItem>{
    
    constructor(Restangular: restangular.IService){
        super("factitems", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(): restangular.ICollectionPromise<IFactItem>{
        return this.Service.withHttpConfig({cache: true}).getList<IFactItem>();
    }
}

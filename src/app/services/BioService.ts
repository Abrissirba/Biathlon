import { ApiBaseService } from './ApiBaseService'
import { IBio } from '../models/models'

export class Bios extends ApiBaseService<IBio>{
    
    constructor(Restangular: restangular.IService){
        super("bios", this.transformResponse, Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return response.data.Bios;
    }

    getList(IBUId: string): restangular.ICollectionPromise<IBio>{
        return this.Service.getList<IBio>({
            IBUId: IBUId
        });
    }
}

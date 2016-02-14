import { ApiBaseService } from './ApiBaseService'
import { IAthlete } from '../models/models'

/** @ngInject */
export class Athletes extends ApiBaseService<IAthlete>{
    
    constructor(Restangular: restangular.IService){
        super("athletes", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data.Athletes;
    }
    
    getList(firstName: string, lastName: string) : restangular.ICollectionPromise<IAthlete>{
        return this.Service.getList<IAthlete>({
            GivenName: firstName,
            FamilyName: lastName
        });
    }

}

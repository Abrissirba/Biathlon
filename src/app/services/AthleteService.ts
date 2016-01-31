import { ApiBaseService } from './ApiBaseService'

export class Athletes extends ApiBaseService{
    
    constructor(Restangular: restangular.IService){
        super("athletes", this.transformResponse, Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data.Athletes;
    }

}

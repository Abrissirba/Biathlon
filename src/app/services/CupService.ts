import { ApiBaseService } from './ApiBaseService'
import { ICup } from '../models/models'

/** @ngInject */
export class Cups extends ApiBaseService<ICup>{
    
    constructor(
        Restangular: restangular.IService,
        private $q: angular.IQService){
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
    
    get(id: string, seasonId: string): angular.IPromise<ICup> {
        var defer = this.$q.defer();
        
        this.getList(seasonId).then((cups: Array<ICup>) => {
            cups.forEach((cup: ICup) => {
                if(cup.CupId === id){
                    defer.resolve(cup);
                }
            })
        });
        
        return defer.promise;
    }
}

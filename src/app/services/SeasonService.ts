import { ApiBaseService } from './ApiBaseService'
import { ISeason } from '../models/models'

/** @ngInject */
export class Seasons extends ApiBaseService<ISeason>{
    
    currentSeason = '1516';
    
    constructor(Restangular: restangular.IService, private $q: angular.IQService){
        super("seasons", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(): restangular.ICollectionPromise<ISeason>{
        return this.Service.withHttpConfig({cache: true}).getList<ISeason>();
    }
    
    get(id: string): angular.IPromise<ISeason> {
        var defer = this.$q.defer();
        
        this.getList().then((seasons: Array<ISeason>) => {
            seasons.forEach((season: ISeason) => {
                if(season.SeasonId === id){
                    defer.resolve(season);
                }
            })
        });
        
        return defer.promise;
    }
}

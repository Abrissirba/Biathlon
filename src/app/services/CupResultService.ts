import { ApiBaseService } from './ApiBaseService'
import { ICupResult, ICup } from '../models/models'
import { Cups } from './services'

/** @ngInject */
export class CupResults extends ApiBaseService<ICupResult>{
    
    constructor(Restangular: restangular.IService,
        private Cups: Cups,
        private $q: angular.IQService){
        super("cupresults", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
         data.Rows.forEach((result: any) => {
            result.Rank = parseInt(<any>result.Rank);
         });
        return data.Rows;
    }

    getList(cupId: string): restangular.ICollectionPromise<ICupResult>{
        return this.Service.getList<ICupResult>({
            CupId: cupId
        });
    }
    
    getListBySeasonAndCupResultDescription(seasonId: string, cupResultDescription: string) : angular.IPromise<Array<ICupResult>> {
        var defer = this.$q.defer();
        
        this.Cups.getList(seasonId).then((cups: Array<ICup>) => {
            var cup = cups.filter((cup: ICup) => {
                return cup.Description === cupResultDescription;
            })[0];
            
            if (cup) {
                this.getList(cup.CupId).then((rankings: Array<ICupResult>) => {
                    defer.resolve(rankings);
                });
            }
            else {
                defer.reject();
            }
        });
        
        return defer.promise;
    }
}

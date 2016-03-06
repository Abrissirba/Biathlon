import { ApiBaseService } from './ApiBaseService'
import { IStatItem } from '../models/models'

/** @ngInject */
export class StatItems extends ApiBaseService<IStatItem>{
    
    constructor(
        Restangular: restangular.IService,
        private $q: angular.IQService){
        super("statitems", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(): restangular.ICollectionPromise<IStatItem>{
        return this.Service.withHttpConfig({cache: true}).getList<IStatItem>({
            Availability: 1
        });
    }
    
    get(statisticId: string) : angular.IPromise<IStatItem> {
        var defer = this.$q.defer();
        
        this.getList().then((statItems: Array<IStatItem>) => {
            statItems.forEach((statItem: IStatItem) => {
                if (statItem.StatisticId === statisticId) {
                   defer.resolve(statItem); 
                }
            });
        });
        
        return defer.promise;
    }
}

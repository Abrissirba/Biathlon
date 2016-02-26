import { Seasons } from './Services'
import { ISeason } from '../models/models'

/** @ngInject */
export class Menus {
    
    constructor(
        private $q: angular.IQService, 
        private Seasons: Seasons){

    }
    
    CupSeasons(activeSeasonId: any) {
        var defer = this.$q.defer();
        this.Seasons.getList().then((seasons: Array<ISeason>) => {
            var items = [];
            for(var i = 0; i < 20; i++){
                items.push({
                   title: seasons[i].Description,
                   active: seasons[i].SeasonId === activeSeasonId,
                   state: 'app.cups({seasonId: "' + seasons[i].SeasonId + '" })'
                });
            }
            defer.resolve(items);
        });
        
        return defer.promise;
    }
}

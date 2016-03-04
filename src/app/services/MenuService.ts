import { Seasons, Cups } from './Services'
import { ISeason, ICup } from '../models/models'

/** @ngInject */
export class Menus {
    
    constructor(
        private $q: angular.IQService, 
        private Seasons: Seasons,
        private Cups: Cups){

    }
    
    CupSeasons(activeSeasonId: any) : angular.IPromise<any> {
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
    
    Cup(activeCupId: string, seasonId: string): angular.IPromise<any> {
        var defer = this.$q.defer();
        this.Cups.getList(seasonId).then((cups: Array<ICup>) => {
            var items = [];
            for(var i = 0; i < 20; i++){
                items.push({
                   title: cups[i].ShortDescription,
                   active: cups[i].CupId === activeCupId,
                   state: 'app.cupresults({cupId: "' + cups[i].CupId + '", seasonId: "' + seasonId + '" })'
                });
            }
            defer.resolve(items);
        });
        
        return defer.promise;
    }
}

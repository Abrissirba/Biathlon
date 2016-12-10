import { Seasons, Cups } from './Services'
import { ISeason, ICup } from '../models/models'

/** @ngInject */
export class Menus {
    
    constructor(
        private $q: angular.IQService, 
        private Seasons: Seasons,
        private Cups: Cups){

    }
    
    Home(){
        var defer = this.$q.defer();
        var items = [{
            title: "SCHEDULE_AND_RESULTS",
            state: 'app.schedule({seasonId: ' + this.Seasons.currentSeason + '})'
        }, {
            title: "STANDINGS",
            state: 'app.cups({seasonId: ' + this.Seasons.currentSeason + '})'
        }, {
            title: "ATHLETES",
            state: 'app.athletes'
        }, {
            title: "STATISTICS",
            state: 'app.stats({seasonId: ' + this.Seasons.currentSeason + '})'
        }, {
            title: "ABOUT",
            state: 'app.about'
        }];
        
        defer.resolve(items);
        return defer.promise;
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
    
    Stats(activeSeasonId: string) : angular.IPromise<any> {
        var defer = this.$q.defer();
        this.Seasons.getList().then((seasons: Array<ISeason>) => {
            var items = [];
            for(var i = 0; i < 20; i++){
                items.push({
                   title: seasons[i].Description,
                   active: seasons[i].SeasonId === activeSeasonId,
                   state: 'app.stats({seasonId: "' + seasons[i].SeasonId + '"})'
                });
            }
            defer.resolve(items);
        });
        
        return defer.promise;
    }
    
    StatDetails(statisticId: string, activeSeasonId: string) : angular.IPromise<any> {
        var defer = this.$q.defer();
        this.Seasons.getList().then((seasons: Array<ISeason>) => {
            var items = [];
            for(var i = 0; i < 20; i++){
                items.push({
                   title: seasons[i].Description,
                   active: seasons[i].SeasonId === activeSeasonId,
                   state: 'app.statisticDefault({seasonId: "' + seasons[i].SeasonId + '", statisticId: "' + statisticId + '"})'
                });
            }
            defer.resolve(items);
        });
        
        return defer.promise;
    }
    
    EventResults(seasonId: string, eventId: string, activeCategory: string) : angular.IPromise<any> {
        var defer = this.$q.defer();
        var items = [];
        items.push({
            title: 'WOMEN_EVENT_RANKING',
            active: activeCategory === 'women',
            state: 'app.eventRankingResults({seasonId: "' + seasonId + '", eventId: "' + eventId + '", category: "women"})'
        }, {
            title: 'MEN_EVENT_RANKING',
            active: activeCategory === 'men',
            state: 'app.eventRankingResults({seasonId: "' + seasonId + '", eventId: "' + eventId + '", category: "men"})'
        });
        
        defer.resolve(items);
        
        return defer.promise;
    }
}

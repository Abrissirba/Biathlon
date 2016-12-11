import { ApiBaseService } from './ApiBaseService'
import { ICompetition, IEvent } from '../models/models'

/** @ngInject */
export class Competitions extends ApiBaseService<ICompetition>{
    
    constructor(
        Restangular: restangular.IService,
        private $q: angular.IQService
    ){
        super("competitions", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(eventId: string): restangular.ICollectionPromise<ICompetition>{
        return this.Service.withHttpConfig({cache: true}).getList<ICompetition>({
            eventId: eventId
        });
    }
    
    get(eventId: string, raceId: string) : angular.IPromise<ICompetition> {
        var defer = this.$q.defer();
        
        this.getList(eventId).then((races: Array<ICompetition>) => {
            for(var i = 0; i < races.length; i++){
                if (races[i].RaceId === raceId) {
                    defer.resolve(races[i]);
                    break;
                }
            }
            defer.reject();
        });
        
        return defer.promise;
    }

    getCurrentCompetition(eventId: string) : angular.IPromise<ICompetition>{
        var defer = this.$q.defer();
        this.getList(eventId).then((races: Array<ICompetition>) => {
            for (var i = 0; i < races.length; i++) {
                if(races[i].StatusId === 5) {
                    defer.resolve(nextRaces);
                    break;
                }
            }
        });
        
        return defer.promise;
    }
    
    getNextCompetitions(eventId: string) : angular.IPromise<Array<ICompetition>>{
        var defer = this.$q.defer();
        var nextRaces = [];
        this.getList(eventId).then((races: Array<ICompetition>) => {
            var now = new Date();
            for (var i = 0; i < races.length; i++) {
                console.log(races[i])
                var startDate = new Date(races[i].StartTime);
                if (now < startDate || races[i].StatusId === 5) {
                    nextRaces.push(races[i]);
                    if (races.length - 1 > i && races[i + 1].StatusId !== 3) {
                         break;
                    }
                    
                }
            }
            defer.resolve(nextRaces);
        });
        
        return defer.promise;
    }
}

import { ApiBaseService } from './ApiBaseService'
import { Seasons } from './Services'
import { IEvent } from '../models/models'

/** @ngInject */
export class Events extends ApiBaseService<IEvent>{
    
    constructor(Restangular: restangular.IService,
        private Seasons: Seasons){
        super("events", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data;
    }

    getList(seasonId: string): restangular.ICollectionPromise<IEvent>{
        return this.Service.withHttpConfig({cache: true}).getList<IEvent>({
            SeasonId: seasonId,
            level: 1
        });
    }
    
    getPreviousEvent(events: Array<IEvent>): IEvent {
        var now = new Date();
        for (var i = 0; i < events.length; i++) {
            var startDate = new Date(events[i].StartDate);
            if (now > startDate) {
                if (i > 0) {
                    return events[i - 1];
                }
                break;
            }
        }
    }
    
    getCurrentEvent(events: Array<IEvent>): IEvent {
        var now = new Date();
        for (var i = 0; i < events.length; i++) {
            var startDate = new Date(events[i].StartDate);
            var endDate = new Date(events[i].EndDate);
            if (now > startDate && now < endDate) {
                return events[i];
                break;
            }
        }
    }
    
    getNextEvent(events: Array<IEvent>): IEvent {
        var now = new Date();
        for (var i = 0; i < events.length; i++) {
            var startDate = new Date(events[i].StartDate);
            if (now < startDate) {
                return events[i];
                break;
            }
        }
    }
}

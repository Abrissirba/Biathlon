import { NavbarState } from './navbar/navbarState';
import { Seasons, Events } from '../services/services';
import { ISeason, IEvent } from '../models/models';

/** @ngInject */
export function abrisHome(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <abris-topbar>
            <abris-navbar-toggle></abris-navbar-toggle>
            <span flex translate>HOME</span>
            <abris-language-selector></abris-language-selector>
        </abris-topbar>
        <md-content>
            <!--<md-card>
                <md-subheader>Last Race</md-subheader>
                <abris-results 
                    season-id="homeVm.lastResults.seasonId" 
                    event-id="homeVm.lastResults.eventId" 
                    race-id="homeVm.lastResults.raceId"
                    static-size="'xs'">
                </abris-results>
            </md-card>-->
        </md-content>
    `,
    controller: HomeController,
    controllerAs: 'homeVm',
    bindToController: true
  };

}

/** @ngInject */
export class HomeController {
    lastResults = {
        seasonId: '1516',
        eventId: 'BT1516SWRLCP08',
        raceId: 'BT1516SWRLCP08SWRL'
    }
   prevEvent: IEvent;
   currentEvent: IEvent;
   nextEvent: IEvent;
    
    
    constructor(
        private NavbarState: NavbarState,
        private Seasons: Seasons,
        private Events: Events) {
        
        this.NavbarState.items = [{
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
        }];
    }
    
    getEvents() {
       this.Events.getList(this.Seasons.currentSeason).then((events: Array<IEvent>) => {
           this.prevEvent = this.Events.getPreviousEvent(events);
           this.currentEvent = this.Events.getCurrentEvent(events);
           this.nextEvent = this.Events.getPreviousEvent(events);
       });
    }
}

import { NavbarState } from './navbar/navbarState';
import { Seasons, Events, Competitions, Menus } from '../services/services';
import { ISeason, IEvent, ICompetition } from '../models/models';

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
            <md-card-list>
                <md-card class="list-item home" ng-if="homeVm.currentEvent" ui-sref="{{ homeVm.getEventLink(homeVm.currentEvent)}}">
                    <div class="md-caption" translate>CURRENT_EVENT</div>
                    <div>{{homeVm.currentEvent.Description}}</div>
                    <div class="status not-finished"></div>
                </md-card>
                <md-card class="list-item home" ng-if="!homeVm.currentEvent && homeVm.nextEvent" ui-sref="{{ homeVm.getEventLink(homeVm.nextEvent)}}">
                    <div class="md-caption" translate>NEXT_EVENT</div>
                    <div>{{homeVm.nextEvent.Description}}</div>
                    <div class="status not-finished"></div>
                </md-card>
                <md-card class="list-item home" ng-repeat="race in homeVm.nextRaces" ui-sref="{{ homeVm.getRaceLink(race)}}">
                    <div layout="row">
                        <div class="md-caption" translate ng-if="::race.StatusId !== 5">NEXT_RACE</div>
                        <div class="md-caption" translate ng-if="::race.StatusId === 5">CURRENT_RACE</div>
                        <div class="md-caption date">{{::race.StartTime | date : 'dd MMM yyyy' : timezone}}</div>
                        <div class="md-caption date">{{::race.StartTime | date : 'HH:mm' : timezone}}</div>
                    </div>
                    <div>{{race.Description}}</div>
                    <div class="status not-finished"></div>
                </md-card>
                <md-card class="list-item home" ng-repeat="item in homeVm.NavbarState.items" ui-sref='{{ item.state }}' ng-if="homeVm.smallDevice">
                    <div>{{item.title | translate}}</div>
                </md-card>
            </md-card-list>
            <!-- <abris-instagram-item ng-repeat="item in homeVm.instagramItems" item-id="item"></abris-instagram-item> -->

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
        seasonId: '1617',
        eventId: 'BT1516SWRLCP08',
        raceId: 'BT1516SWRLCP08SWRL'
    }
   prevEvent: IEvent;
   currentEvent: IEvent;
   nextEvent: IEvent;
   nextRaces: Array<ICompetition>;
   currentRace: ICompetition;
   smallDevice: boolean;
    instagramItems = [
        "BNMpQ2WDv8B",
        "BNPVkmigRz_",
        "BNPw--sDzwd",
        "BNPxpg_hTr2"
    ]
    constructor(
        private NavbarState: NavbarState,
        private Seasons: Seasons,
        private Events: Events,
        private Menus: Menus,
        private Competitions: Competitions,
        private screenSize: any) {
        
        this.Menus.Home().then((items: any) => {
            this.NavbarState.items = items;
        });
        
        this.setSizeListeners();
        
        this.getEvents();
    }
    
    getEvents() {
       this.Events.getList(this.Seasons.currentSeason).then((events: Array<IEvent>) => {
           this.prevEvent = this.Events.getPreviousEvent(events);
           this.currentEvent = this.Events.getCurrentEvent(events);
           this.nextEvent = this.Events.getNextEvent(events);
           
           if (this.currentEvent) {
               this.getCompetitions(this.currentEvent);
           }
       });
    }
    
    getCompetitions(event: IEvent) {
        this.Competitions.getCurrentCompetition(event.EventId).then((race: ICompetition) => {
            this.currentRace = race;
        });

        this.Competitions.getNextCompetitions(event.EventId).then((races: Array<ICompetition>) => {
            this.nextRaces = races;
        });
    }
    
    getEventLink(event: IEvent){
        return "app.competitions({seasonId: '" + this.Seasons.currentSeason + "', eventId: '" + event.EventId + "'})";
    }
    
    getRaceLink(race: ICompetition){
        return "app.results({seasonId: '" + this.Seasons.currentSeason + "', eventId: '" + this.currentEvent.EventId + "', raceId: '" + race.RaceId + "'})";
    }
    
    setSizeListeners() {
        this.smallDevice = this.screenSize.is('xs, sm');
        this.screenSize.on('xs, sm', (match) =>{
            this.smallDevice = match;
        });
    }
}

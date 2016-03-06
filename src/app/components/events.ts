import { Events, TableHelperService, Seasons } from '../services/services';
import { IEvent, ISeason } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisEvents(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
    <abris-topbar>
        <abris-navbar-toggle></abris-navbar-toggle>
        <span ng-show="!resultsVm.searchMode" flex translate>{{eventsVm.season.Description}}</span>
    </abris-topbar>
    <md-content>
    <md-card ng-if="!eventsVm.mobile">
        <md-table-container>
            <table md-table md-row-select='false' ng-model='eventsVm.selected' md-progress='eventsVm.promise'>
                <thead md-head md-order='eventsVm.query.order' md-on-reorder='eventsVm.onReorder'>
                    <tr md-row>
                        <th md-column md-order-by='StartDate'><span translate>DATE</span></th>
                        <th md-column md-order-by='Organizer'><span translate>PLACE</span></th>
                        <th md-column md-order-by='Description'><span translate>EVENT</span></th>
                    </tr>
                </thead>
                <tbody md-body>
                    <tr md-row ng-repeat='event in eventsVm.events track by event.EventId' ui-sref="app.competitions({seasonId: eventsVm.seasonId, eventId: event.EventId})">
                        <td md-cell>{{::event.StartDate | date : 'dd MMM yyyy' : timezone}}</td>
                        <td md-cell><abris-flag country-code="{{event.Nat}}" style="padding-right: 8px;"></abris-flag> {{::event.Organizer}}</td>
                        <td md-cell>{{::event.Description}}</td>
                    </tr>
                </tbody>
            </table>
        </md-table-container>
    </md-card>
    
    <md-card-list ng-if="eventsVm.mobile">
        <md-card class="list-item" ng-repeat="event in eventsVm.events track by event.EventId"  ui-sref="app.competitions({seasonId: eventsVm.seasonId, eventId: event.EventId})">
            <div layout="row" layout-align="center center">
                <div>
                    <abris-flag country-code="{{::event.Nat}}"></abris-flag>
                </div>
                <div class="md-subhead">{{::event.Organizer}}</div>
                <div class="md-caption" flex>{{::event.StartDate | date : 'dd MMM yyyy' : timezone}}</div>
            </div>
            <div layout="row" style="padding-top: 4px;">
                <div>{{::event.Description}}</div>
            </div>
            <div class="status" ng-class="{finished: eventsVm.hasFinished(event), 'not-finished': !eventsVm.hasFinished(event)}"></div>
        </md-card>
    </md-card-list>
    </md-content>
    `,
    controller: EventsController,
    controllerAs: 'eventsVm',
    bindToController: true
  };

}

/** @ngInject */
export class EventsController extends TableBaseController<IEvent> {
    
    events: Array<IEvent>;
    seasonId: string;
    season: ISeason;
    mobile: string;
    desktop: string;
    
    constructor(
        TableHelperService: TableHelperService,
        Events: Events,
        private Seasons: Seasons,
        private NavbarState: NavbarState,
        private $state: angular.ui.IStateService,
        private screenSize: any) {
        
        super(TableHelperService, 'events');
        
        this.seasonId = this.$state.params['seasonId'];
        
        this.promise = Events.getList(this.seasonId).then((data) => {
            this.events = data;
        });
        
        this.Seasons.getList().then((seasons: Array<ISeason>) => {
            seasons.forEach((season: ISeason) => {
                if(season.SeasonId === this.seasonId){
                    this.season = season;
                }
            });
        });
        
        this.Seasons.getList().then((seasons: Array<ISeason>) => {
            var items = [];
            for(var i = 0; i < 20; i++){
                items.push({
                   title: seasons[i].Description,
                   active: seasons[i].SeasonId === this.seasonId,
                   state: 'app.schedule({seasonId: "' + seasons[i].SeasonId + '"})'
                });
            }
            this.NavbarState.items = items;
        });
        
        this.setSizeListeners();
    }
    
    setSizeListeners() {
        this.mobile = this.screenSize.on('xs', (match) =>{
            this.mobile = match;
        });
        this.desktop = this.screenSize.on('sm, md, lg', (match) => {
            this.desktop = match;
        });
    }
    
    hasFinished(event: IEvent) {
        return new Date(event.EndDate) < new Date();
    }
}
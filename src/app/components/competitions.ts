import { Competitions, TableHelperService, Events } from '../services/services';
import { ICompetition, IEvent } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisCompetitions(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
    <abris-topbar>
        <abris-navbar-toggle></abris-navbar-toggle>
        <abris-flag country-code="{{::competitionsVm.event.Nat}}" style="margin-right: 8px;"></abris-flag>
        <span flex translate>{{::competitionsVm.event.Organizer}}</span>
    </abris-topbar>
    <md-content>
        <md-card ng-if="!competitionsVm.mobile">
            <md-table-container>
                <table md-table md-row-select='false' ng-model='competitionsVm.selected' md-progress='competitionsVm.promise'>
                    <thead md-head md-order='competitionsVm.query.order' md-on-reorder='competitionsVm.onReorder'>
                    <tr md-row>
                        <th md-column md-order-by='StartTime'><span translate>DATE</span></th>
                        <th md-column md-order-by='StartTime'><span translate>TIME</span></th>
                        <th md-column md-order-by='Description'><span translate>COMPETITION</span></th>
                        <th md-column md-order-by='StatusId'><span translate>STATUS</span></th>
                    </tr>
                    </thead>
                    <tbody md-body>
                    <tr md-row ng-repeat='competition in competitionsVm.competitions track by competition.RaceId' ui-sref="app.results({seasonId: competitionsVm.seasonId, eventId: competitionsVm.eventId, raceId: competition.RaceId})">
                        <td md-cell>{{::competition.StartTime | date : 'dd MMM yyyy' : timezone}}</td>
                        <td md-cell>{{::competition.StartTime | date : 'HH:mm' : timezone}}</td>
                        <td md-cell>{{::competition.Description}}</td>
                        <td md-cell>{{::competition.StatusText}}</td>
                    </tr>
                    </tbody>
                </table>
            </md-table-container>
            
            <md-table-container>
                <table md-table md-row-select='false'>
                    <tbody md-body>
                    <tr md-row ng-repeat="eventRanking in competitionsVm.eventRankings track by $id(eventRanking)"  ui-sref="app.eventRankingResults({seasonId: competitionsVm.seasonId, eventId: competitionsVm.eventId, category: eventRanking.Category})">
                        <td md-cell>{{::eventRanking.Title}}</td>
                    </tr>
                    </tbody>
                </table>
            </md-table-container>
        </md-card>
        
        <md-card-list ng-if="competitionsVm.mobile">
            <md-card class="list-item" ng-repeat="competition in competitionsVm.competitions track by competition.RaceId"  ui-sref="app.results({seasonId: competitionsVm.seasonId, eventId: competitionsVm.eventId, raceId: competition.RaceId})">
                <div layout="row" layout-align="center center">
                    <div class="md-caption">{{::competition.StartTime | date : 'dd MMM yyyy' : timezone}}</div>
                    <div class="md-caption" flex>{{::competition.StartTime | date : 'HH:mm' : timezone}}</div>
                </div>
                <div layout="row">
                    <div class="md-subhead">{{::competition.ShortDescription}}</div>
                </div>
                <div class="status" ng-class="{finished: competitionsVm.hasFinished(competition), 'not-finished': !competitionsVm.hasFinished(competition)}"></div>
            </md-card>
            <md-card class="list-item" ng-repeat="eventRanking in competitionsVm.eventRankings track by $id(eventRanking)"  ui-sref="app.eventRankingResults({seasonId: competitionsVm.seasonId, eventId: competitionsVm.eventId, category: eventRanking.Category})">
                <div layout="row">
                    <div class="md-subhead">{{::eventRanking.Title | translate}}</div>
                </div>
            </md-card>
        </md-card-list>
    </md-content>
    `,
    controller: CompetitionsController,
    controllerAs: 'competitionsVm',
    bindToController: true
  };

}

/** @ngInject */
export class CompetitionsController extends TableBaseController<ICompetition> {
    
    competitions: Array<ICompetition>;
    seasonId: string;
    eventId: string;
    event: IEvent;
    mobile: string;
    desktop: string;
    
    eventRankings = [{
        Title: 'WOMENS_EVENT_RANKING',
        Category: 'women'
    },{
        Title: 'MEN_EVENT_RANKING',
        Category: 'men'
    }]
    
    constructor(
        TableHelperService: TableHelperService,
        Competitions: Competitions,
        private Events: Events,
        private NavbarState: NavbarState,
        private $state: angular.ui.IStateService,
        private screenSize: any) {
        
        super(TableHelperService, 'competitions');
        
        this.eventId = this.$state.params['eventId'];
        this.seasonId = this.$state.params['seasonId'];
        
        this.Events.getList(this.seasonId).then((events: Array<IEvent>) => {
            events.forEach((event: IEvent) => {
                if(event.EventId === this.eventId){
                    this.event = event;
                }
            });
        });
        
        this.Events.getList(this.seasonId).then((events: Array<IEvent>) => {
            var items = [];
            events.forEach((event: IEvent) => {
                items.push({
                   title: event.Organizer,
                   active: event.EventId === this.eventId,
                   state: 'app.competitions({seasonId: "' + this.seasonId + '", eventId: "' + event.EventId + '"})'
                });
            });
            this.NavbarState.items = items;
        });
        
        this.promise = Competitions.getList(this.eventId).then((data) => {
            this.competitions = data;
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
    
    hasFinished(competition: ICompetition) {
        return competition.StatusText === "Final";
    }
}
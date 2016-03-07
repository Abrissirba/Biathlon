import { Rankings, TableHelperService, Events, Menus } from '../services/services';
import { IEvent, IEventResult } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisEventRankingResults(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
    <abris-topbar>
        <abris-navbar-toggle></abris-navbar-toggle>
        <span ng-show="!eventRankingResultsVm.searchMode" flex translate>{{eventRankingResultsVm.event.Organizer}}</span>
        
        <abris-input-search ng-model="eventRankingResultsVm.searchText" ng-class="{flex: eventRankingResultsVm.searchMode}" search-mode="eventRankingResultsVm.searchMode"></abris-input-search>
    
        <abris-input-filter on-reorder="eventRankingResultsVm.onReorder" order-items="eventRankingResultsVm.orderProps" filter-items="eventRankingResultsVm.filters"></abris-input-filter>
    </abris-topbar>
    <md-content>
    <md-card ng-if="!eventRankingResultsVm.smallDevice">
        <md-table-container>
            <table md-table md-row-select='false' ng-model='eventRankingResultsVm.selected' md-progress='eventRankingResultsVm.promise'>
                <thead md-head md-order='eventRankingResultsVm.query.order' md-on-reorder='eventRankingResultsVm.onReorder'>
                        <tr md-row>
                            <th md-column md-numeric md-order-by='Rank' style="width: 5%"><span translate>RANK</span></th>
                            <th md-column md-order-by='Name' style="width: 50%"><span translate>NAME</span></th>
                            <th md-column md-order-by='Nat' style="width: 10%"><span translate>NAT</span></th>
                            <th md-column md-numeric  md-order-by='Score' style="width: 10%"><span translate>SCORE</span></th>
                            <th md-column md-numeric  md-order-by='RacePositions' style="width: 10%"><span translate>RACE_POSITIONS</span></th>
                            <th md-column md-numeric  md-order-by='WorldCupRank' style="width: 10%"><span translate>WORLD_CUP_RANK</span></th>
                        </tr>
                    </thead>
                    <tbody md-body>
                        <tr md-row ng-repeat='ranking in eventRankingResultsVm.rankings track by $id(ranking)'  ng-click="eventRankingResultsVm.openAnalysis(result)">
                            <td md-cell><span>{{::ranking.Rank}}</span></td>
                            <td md-cell>
                                <abris-avatar ng-if="ranking.IBUId.length !== 3" ibuid="ranking.IBUId"></abris-avatar>
                                {{::ranking.Name}}</td>
                            <td md-cell><abris-flag country-code="{{::ranking.Nat}}"></abris-flag></td>
                            <td md-cell>{{::ranking.Score}}</td>
                            <td md-cell>
                                <span ng-repeat="racePos in ranking.RacePositions track by $index">
                                    {{::racePos}}
                                </span>
                            </td>
                            <td md-cell>{{::ranking.WorldCupRank}}</td>
                        </tr>
                        
                    </tbody>
            </table>
        </md-table-container>
    </md-card>
    
    <md-card-list ng-if="eventRankingResultsVm.smallDevice">
        <md-card class="list-item" ng-repeat="ranking in eventRankingResultsVm.rankings track by ranking.IBUId">
            <div layout="row" layout-align="center center">
                <div class="md-subhead">{{ranking.Rank}}</div>
                <div class="no-padding" ng-if="ranking.IBUId.length !== 3"><abris-avatar ibuid="ranking.IBUId"></abris-avatar></div>
                <div flex>{{ranking.Name}}</div>
                <div>{{ranking.Score}}</div>
                <div class="no-padding" layout="row" layout-align="end center">
                    <abris-flag country-code="{{ranking.Nat}}"></abris-flag>
                </div>
            </div>
            <div layout="row" style="padding-top: 0">
                    <div layout="column">
                        <div class="md-caption" translate>RACE_POSITIONS</div>
                        <div class="">
                            <span ng-repeat="racePos in ranking.RacePositions track by $index">
                                {{racePos}}
                            </span>
                        </div>
                    </div>
                    <div layout="column">
                        <div class="md-caption" translate>WORLD_CUP_RANK</div>
                        <div class="">{{ranking.WorldCupRank}}</div>
                    </div>
                </div>
        </md-card>
    </md-card-list>
    </md-content>
    `,
    controller: EventRankingResultsController,
    controllerAs: 'eventRankingResultsVm',
    bindToController: true
  };

}

/** @ngInject */
export class EventRankingResultsController extends TableBaseController<IEvent> {
    
    eventId: string;
    event: IEvent;
    seasonId: string;
    category: string;
    rankings: Array<IEventResult>;
    _rankings: Array<IEventResult>;
    smallDevice: boolean;
    searchText: string;
    searchMode: boolean;
    
    orderProps = [{
        title: 'RANK',
        key: 'Rank'
    }, {
        title: 'NAME',
        key: 'Name'
    }, {
        title: 'NATIONALITY',
        key: 'Nat'
    }, {
        title: 'WORLD_CUP_RANK',
        key: 'WorldCupRank'
    }];
    
    filters = [{
        title: 'MASSSTART',
        key: 'MassStart',
        active: false,
        callback: (item: any) => this.massStartFilter(item)
    }];
    
    constructor(
        TableHelperService: TableHelperService,
        private Rankings: Rankings,
        private Events: Events,
        private NavbarState: NavbarState,
        private $state: angular.ui.IStateService,
        private screenSize: any,
        private $scope: angular.IScope,
        private Menus: Menus) {
        
        super(TableHelperService, 'rankings');
        
        $scope.$watch('eventRankingResultsVm.searchText', (val: string) => this.filter(val));
        
        this.seasonId = this.$state.params['seasonId'];
        this.eventId = this.$state.params['eventId'];
        this.category = this.$state.params['category'];
        
        this.promise = Rankings.getEventRanking(this.eventId, this.seasonId, this.category).then((data) => {
            this.rankings = data;
            this._rankings = data;
        });
        
        this.Events.get(this.eventId, this.seasonId).then((event: IEvent) => {
            this.event = event;
        });
        
        this.Menus.EventResults(this.seasonId, this.eventId, this.category).then((items: any) => {
            this.NavbarState.items = items;
        });
        
        this.setSizeListeners();
    }
    
    setSizeListeners() {
        this.smallDevice = this.screenSize.on('xs, sm', (match) =>{
            this.smallDevice = match;
        });
    }
    
    filter(val: string){
        if(angular.isDefined(val)){
            val = val.toLowerCase();
            
            if (this.rankings) {
                this.rankings = this._rankings.filter((result: IEventResult) => {
                    return result.Nat.toLowerCase().indexOf(val) > -1 || result.Name.toLowerCase().indexOf(val) > -1;
                }); 
            }
        }
    }
    
    massStartFilter(item: any) {
        if (item.active) {
            var bestOfTheRest = [];
            this.rankings = this._rankings.filter((ranking: IEventResult) => {
                var wcRank = ranking.WorldCupRank <= 15;
                var medalWinner = ranking.RacePositions.filter((pos: number) => {
                    return pos <= 3;
                }).length > 0;
                if (!(wcRank || medalWinner)) {
                    bestOfTheRest.push(ranking);    
                }
                
                return wcRank;
            });
            
            var index = 30 - this.rankings.length;
            for (var i = 0; i < index; i++) {
                this.rankings.push(bestOfTheRest[i]);
            }
        }
        else {
            this.rankings = this._rankings;
        }
    }
}
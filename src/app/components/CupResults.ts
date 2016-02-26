import { CupResults, TableHelperService, Seasons } from '../services/services';
import { ICupResult, ISeason } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisCupResults(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        seasonId: '=?',
        cupId: '=?'
    },
    template: `
    <abris-topbar>
        <abris-navbar-toggle></abris-navbar-toggle>
        <span ng-show="!resultsVm.searchMode" flex translate>{{cupResultsVm.season.Description}}</span>
    </abris-topbar>
    <md-content>
    <md-card ng-if="!cupResultsVm.mobile">
        <md-table-container>
            <table md-table md-row-select='false' ng-model='cupResultsVm.selected' md-progress='cupResultsVm.promise'>
                <thead md-head md-order='cupResultsVm.query.order' md-on-reorder='cupResultsVm.onReorder'>
                    <tr md-row>
                        <th md-column md-order-by='StartDate'><span translate>DATE</span></th>
                        <th md-column md-order-by='Organizer'><span translate>PLACE</span></th>
                        <th md-column md-order-by='Description'><span translate>EVENT</span></th>
                    </tr>
                </thead>
                <tbody md-body>
                    <tr md-row ng-repeat='event in cupResultsVm.cupResults track by event.EventId' ui-sref="app.competitions({seasonId: cupResultsVm.seasonId, eventId: event.EventId})">
                        <td md-cell>{{::event.StartDate | date : 'dd MMM yyyy' : timezone}}</td>
                        <td md-cell><abris-flag country-code="{{event.Nat}}" style="padding-right: 8px;"></abris-flag> {{::event.Organizer}}</td>
                        <td md-cell>{{::event.Description}}</td>
                    </tr>
                </tbody>
            </table>
        </md-table-container>
    </md-card>
    
    <md-card-list ng-if="cupResultsVm.mobile">
        <md-card class="list-item" ng-repeat="event in cupResultsVm.cupResults track by event.EventId"  ui-sref="app.competitions({seasonId: cupResultsVm.seasonId, eventId: event.EventId})">
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
        </md-card>
    </md-card-list>
    </md-content>
    `,
    controller: CupResultsController,
    controllerAs: 'cupResultsVm',
    bindToController: true
  };

}

/** @ngInject */
export class CupResultsController extends TableBaseController<ICupResult> {
    
    cupResults: Array<ICupResult>;
    seasonId: string;
    cupId: string;
    season: ISeason;
    mobile: string;
    desktop: string;
    
    constructor(
        TableHelperService: TableHelperService,
        CupResults: CupResults,
        private Seasons: Seasons,
        private NavbarState: NavbarState,
        private $state: angular.ui.IStateService,
        private screenSize: any) {
        
        super(TableHelperService, 'cupResults');
        
        this.seasonId =  this.seasonId || this.$state.params['seasonId'];
        this.cupId = this.cupId || this.$state.params['cupid'];
        
        this.promise = CupResults.getList(this.seasonId).then((data) => {
            this.cupResults = data;
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
}
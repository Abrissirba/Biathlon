import { Cups, TableHelperService, Seasons, Menus } from '../services/services';
import { ICup, ISeason } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisCups(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        seasonId: '=?'
    },
    template: `
    <abris-topbar>
        <abris-navbar-toggle></abris-navbar-toggle>
        <span flex translate>{{cupsVm.season.Description}}</span>
    </abris-topbar>
    <md-content>
    <md-card ng-if="!cupsVm.mobile">
        <md-table-container>
            <table md-table md-row-select='false' ng-model='cupsVm.selected' md-progress='cupsVm.promise'>
                <thead md-head md-order='cupsVm.query.order' md-on-reorder='cupsVm.onReorder'>
                    <tr md-row>
                        <th md-column md-order-by='ShortDescription'><span translate>CUP</span></th>
                    </tr>
                </thead>
                <tbody md-body>
                    <tr md-row ng-repeat='cup in cupsVm.cups track by cup.CupId' ui-sref="app.cupresults({seasonId: cupsVm.seasonId, cupId: cup.CupId})">
                        <td md-cell>{{cup.ShortDescription | translate}}</td>
                    </tr>
                </tbody>
            </table>
        </md-table-container>
    </md-card>
    
    <md-card-list ng-if="cupsVm.mobile">
        <md-card class="list-item" ng-repeat="cup in cupsVm.cups track by cup.CupId"  ui-sref="app.cupresults({seasonId: cupsVm.seasonId, cupId: cup.CupId})">
            <div layout="row" layout-align="center center">
                <div  flex>{{cup.ShortDescription | translate}}</div>
            </div>
        </md-card>
    </md-card-list>
    </md-content>
    `,
    controller: CupsController,
    controllerAs: 'cupsVm',
    bindToController: true
  };

}

/** @ngInject */
export class CupsController extends TableBaseController<ICup> {
    
    cups: Array<ICup>;
    seasonId: string;
    season: ISeason;
    mobile: string;
    desktop: string;
    
    constructor(
        TableHelperService: TableHelperService,
        Cups: Cups,
        private Seasons: Seasons,
        private Menus: Menus,
        private NavbarState: NavbarState,
        private $state: angular.ui.IStateService,
        private screenSize: any) {
        
        super(TableHelperService, 'cups');
        
        this.seasonId = this.seasonId || this.$state.params['seasonId'];
        
        this.promise = Cups.getList(this.seasonId).then((data) => {
            this.cups = data;
        });
        
        this.Seasons.get(this.seasonId).then((season: ISeason) => {
            this.season = season;
        });
        
        this.Menus.CupSeasons(this.seasonId).then((items: Array<any>) => {
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
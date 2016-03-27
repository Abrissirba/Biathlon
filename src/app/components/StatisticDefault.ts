import { Stats, StatItems, TableHelperService, Seasons, Menus } from '../services/services';
import { IStat, IStatItem } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisStatisticDefault(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        statisticId: '=?',
        seasonId: '=?',
    },
    template: `
    <abris-topbar>
        <abris-navbar-toggle></abris-navbar-toggle>
        
        <span ng-if="!statisticDefaultVm.searchMode" flex translate>{{statisticDefaultVm.statItem.ShortDescription}}</span>
        
        <abris-input-search ng-model="statisticDefaultVm.searchText" ng-class="{flex: statisticDefaultVm.searchMode}" search-mode="statisticDefaultVm.searchMode"></abris-input-search>
        
        <abris-input-filter on-reorder="statisticDefaultVm.onReorder" order-items="statisticDefaultVm.orderProps"></abris-input-filter>
    </abris-topbar>
    
    
    <md-content>

    <md-card ng-if="!statisticDefaultVm.mobile">
        <md-table-container>
            <table md-table md-row-select='false' ng-model='statisticDefaultVm.selected' md-progress='statisticDefaultVm.promise'>
                <thead md-head md-order='statisticDefaultVm.query.order' md-on-reorder='statisticDefaultVm.onReorder'>
                    <tr md-row>
                        <th md-column md-numeric width="5%" md-order-by='SortOrder'><span translate>RANK</span></th>
                        <th md-column md-order-by='Name'><span translate>NAME</span></th>
                        <th md-column md-order-by='Nat'><span translate>NATIONALITY</span></th>
                        <th md-column md-order-by='Value'><span translate>VALUE</span></th>
                        <th md-column md-order-by='Details'><span translate>DETAILS</span></th>
                    </tr>
                </thead>
                <tbody md-body>
                    <tr md-row ng-repeat='stat in statisticDefaultVm.stats track by $id(stat)' ng-click="statisticDefaultVm.openGraph(stat)">
                        <td md-cell>
                            {{::stat.SortOrder}}
                        </md-cell>
                        <td md-cell>
                            <abris-avatar ibuid="stat.IBUId"></abris-avatar>
                            {{::stat.Name}}
                        </td>
                        <td md-cell>
                            <abris-flag country-code="{{::stat.Nat}}"></abris-flag>
                        </td>
                        <td md-cell>
                            {{::stat.Value}}
                        </md-cell>
                        <td md-cell>
                            {{::stat.Extra}}
                        </md-cell>
                    </tr>
                </tbody>
            </table>
        </md-table-container>
    </md-card>
    <md-card-list ng-if="statisticDefaultVm.mobile">
        <md-virtual-repeat-container>
            <md-card class="list-item" md-virtual-repeat="stat in statisticDefaultVm.stats" ng-click="statisticDefaultVm.openGraph(stat)">
                <div layout="row" layout-align="center center">
                    <div>{{stat.SortOrder}}</div>
                    <abris-avatar ibuid="stat.IBUId"></abris-avatar>
                    <div flex>{{stat.Name}}</div>
                    <div><abris-flag country-code="{{stat.Nat}}"></abris-flag></div>
                </div>
                <div layout="row" style="padding-top: 0">
                    <div layout="column">
                        <div class="md-caption" translate>VALUE</div>
                        <div class="md-body-2">{{stat.Value}}</div>
                    </div>
                    <div layout="column">
                        <div class="md-caption" translate>DETAILS</div>
                        <div class="md-body-2">{{stat.Extra}}</div>
                    </div>
                </div>
            </md-card>
        </md-virtual-repeat-container>
    </md-card-list>
    </md-content>
    `,
    controller: StatisticDefaultController,
    controllerAs: 'statisticDefaultVm',
    bindToController: true
  };

}

/** @ngInject */
export class StatisticDefaultController extends TableBaseController<IStat> {
    
    _stats: Array<IStat>;
    stats: Array<IStat>;
    statisticId: string;
    statItem: IStatItem;
    seasonId: string;
    mobile: string;
    desktop: string;
    searchMode: boolean = false;
    searchText: string = '';
    orderProps: Array<any> = [{
        key: "SortOrder",
        title: "RANK"
    }, {
        key: "Name",
        title: "NAME"
    }, {
        key: "Nat",
        title: "NATIONALITY"
    }, {
        key: "Value",
        title: "VALUE"
    }]
    
    constructor(
        TableHelperService: TableHelperService,
        private Stats: Stats,
        private StatItems: StatItems,
        private Menus: Menus,
        private NavbarState: NavbarState,
        private $state: angular.ui.IStateService,
        private screenSize: any,
        private $scope: angular.IScope,
        private $timeout: angular.ITimeoutService,
        private $element: any,
        private $mdDialog: angular.material.IDialogService) {
        
        super(TableHelperService, 'stats');
        
        $scope.$watch('statisticDefaultVm.searchText', (val: string) => this.filter(val));
        
        this.statisticId = this.statisticId || this.$state.params['statisticId'];
        this.seasonId = this.seasonId || this.$state.params['seasonId'];
        
        this.promise = this.StatItems.get(this.statisticId).then((data) => {
            this.statItem = data;
            
            this.promise = this.Stats.getList({
                byWhat: "ATH",
                genderId: this.statItem.AthleteGender,
                seasonId: this.seasonId,
                statId: this.statItem.StatId,
                statisticId: this.statItem.StatisticId,
            }).then((data) => {
                this._stats = data;
                this.stats = data;
            })
        });
        
        this.Menus.StatDetails(this.statisticId, this.seasonId).then((items: Array<any>) => {
            this.NavbarState.items = items;
        });
        
        this.setSizeListeners();
        this.setVerticalContainerHeight(this.$timeout, this.$element, this.$scope);
    }
    
    filter(text: string) {
        if(this._stats){
            this.stats = this._stats.filter((stat: IStat) => {
                return stat.Name.toLowerCase().indexOf(text) > -1 || stat.Nat.toLowerCase().indexOf(text) > -1;
            });
        }  
    }
    
    setSizeListeners() {
        this.mobile = this.screenSize.on('xs', (match) =>{
            this.mobile = match;
        });
        this.desktop = this.screenSize.on('sm, md, lg', (match) => {
            this.desktop = match;
        });
    }
    
    openGraph(stat: IStat) {
        (<any>this.$mdDialog).showAbrisComponentDialog({
            componentName: 'abrisStatGraph',
            title: stat.Name,
            params: {
                statisticId: this.statItem.StatisticId,
                ibuid: stat.IBUId
            },
            fullscreen: true
        });
    }
}
import { CupResults, TableHelperService, Seasons, Cups, Menus, ImageService } from '../services/services';
import { ICupResult, ISeason, ICup } from '../models/models';
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
        <span ng-show="!cupResultsVm.searchMode" translate>{{cupResultsVm.cup.ShortDescription}}</span>
        
        <span ng-show="cupResultsVm.searchMode" layout="row">
            <md-icon class="material-icons">search</md-icon>
            <md-input-container layout="row">
                <input ng-model="cupResultsVm.searchString" abris-focus="cupResultsVm.searchFieldFocus">
            </md-input-container>
        </span>
        
        <div flex></div>
        
        <md-button class="md-icon-button" aria-label="Favorite" ng-click="cupResultsVm.searchMode = true; cupResultsVm.searchFieldFocus();" ng-if="!cupResultsVm.searchMode">
            <md-icon class="material-icons">search</md-icon>
        </md-button>
        <md-button class="md-icon-button" aria-label="Favorite" ng-click="cupResultsVm.searchMode = false" ng-if="cupResultsVm.searchMode">
            <md-icon class="material-icons">close</md-icon>
        </md-button>
        
        <md-menu>
            <md-button class="md-icon-button" aria-label="More" ng-click="$mdOpenMenu($event)">
                <md-icon md-menu-origin class="material-icons">filter_list</md-icon>
            </md-button>
            <md-menu-content>
                <md-menu-item ng-repeat="item in cupResultsVm.orderProps">
                    <md-button ng-click="cupResultsVm.onReorder(item.key)">
                        {{item.title | translate}}
                    </md-button>
                </md-menu-item>
            </md-menu-content>
        </md-menu>
    </abris-topbar>
    <md-content>
        <md-card ng-if="!cupResultsVm.mobile">
            <md-table-container>
                <table md-table md-row-select='false' ng-model='cupResultsVm.selected' md-progress='cupResultsVm.promise'>
                    <thead md-head md-order='cupResultsVm.query.order' md-on-reorder='cupResultsVm.onReorder'>
                        <tr md-row>
                            <th md-column md-numeric md-order-by='Rank' style="width: 5%"><span translate>RANK</span></th>
                            <th md-column md-order-by='Name' style="width: 50%"><span translate>NAME</span></th>
                            <th md-column md-order-by='Nat' style="width: 10%"><span translate>NAT</span></th>
                            <th md-column md-numeric  md-order-by='Score' style="width: 10%"><span translate>SCORE</span></th>
                        </tr>
                    </thead>
                    <tbody md-body>
                        <tr md-row ng-repeat='cupResult in cupResultsVm.cupResults track by $id(cupResult)'  ng-click="cupResultsVm.openAnalysis(result)">
                            <td md-cell><span>{{::cupResult.Rank}}</span></td>
                            <td md-cell>
                                <img ng-if="cupResult.IBUId.length !== 3" class="md-avatar" ng-src="{{::cupResultsVm.getAvatarUrl(cupResult)}}"></img>
                                {{::cupResult.Name}}</td>
                            <td md-cell><abris-flag country-code="{{::cupResult.Nat}}"></abris-flag></td>
                            <td md-cell>{{::cupResult.Score}}</td>
                        </tr>
                        
                    </tbody>
                </table>
            </md-table-container>
        </md-card>
        
        <md-card-list ng-if="cupResultsVm.mobile">
            <md-virtual-repeat-container>
                <md-card class="list-item" md-virtual-repeat="cupResult in cupResultsVm.cupResults">
                    <div layout="row" layout-align="center center">
                        <div class="md-subhead">{{cupResult.Rank}}</div>
                        <div class="no-padding" ng-if="cupResult.IBUId.length !== 3"><img class="md-avatar" ng-src="{{cupResultsVm.getAvatarUrl(cupResult)}}"></img></div>
                        <div flex>{{cupResult.Name}}</div>
                        <div>{{cupResult.Score}}</div>
                        <div class="no-padding" layout="row" layout-align="end center">
                            <abris-flag country-code="{{cupResult.Nat}}"></abris-flag>
                        </div>
                    </div>
                </md-card>
            </md-virtual-repeat-container>
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
    _cupResults: Array<ICupResult>;
    seasonId: string;
    cupId: string;
    season: ISeason;
    cup: ICup;
    mobile: string;
    desktop: string;
    
    orderProps = [{
        title: 'RANK',
        key: 'Rank'
    }, {
        title: 'NAME',
        key: 'Name'
    }, {
        title: 'NATIONALITY',
        key: 'Nat'
    }];
    
    constructor(
        TableHelperService: TableHelperService,
        CupResults: CupResults,
        private Seasons: Seasons,
        private Cups: Cups,
        private Menus: Menus,
        private ImageService: ImageService,
        private NavbarState: NavbarState,
        private $element: any,
        private $state: angular.ui.IStateService,
        private screenSize: any,
        private $timeout: angular.ITimeoutService,
        private $scope: any) {
        
        super(TableHelperService, 'cupResults');
        
        $scope.$watch('cupResultsVm.searchString', (val: string) => this.filter(val));
        
        this.seasonId =  this.seasonId || this.$state.params['seasonId'];
        this.cupId = this.cupId || this.$state.params['cupId'];
        
        this.promise = CupResults.getList(this.cupId).then((data) => {
            this._cupResults = data;
            this.cupResults = data;
        });
        
        this.Cups.get(this.cupId, this.seasonId).then((cup: ICup) => {
            this.cup = cup;
        })
        
        this.Menus.Cup(this.cupId, this.seasonId).then((items: any) => {
            this.NavbarState.items = items;
        });
        
        this.setSizeListeners();
        this.setVerticalContainerHeight();
    }
    
    setVerticalContainerHeight() {
        this.$timeout(() => {
            var elements = this.$element.find('md-virtual-repeat-container');
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var height = window.innerHeight - element.offsetTop;

                element.style.height = height + 'px';
                console.log(element);
            }
            this.$scope.$broadcast('$md-resize');
        });
    }
    
    setSizeListeners() {
        this.mobile = this.screenSize.on('xs', (match) =>{
            this.mobile = match;
        });
        this.desktop = this.screenSize.on('sm, md, lg', (match) => {
            this.desktop = match;
        });
    }
    
    getAvatarUrl(result: ICupResult){
        if(result.Leg !== 0){
            return this.ImageService.getImageUrl(result.IBUId);
        }
    }
    
    filter(val: string){
        if(angular.isDefined(val)){
            val = val.toLowerCase();
            
            if (this.cupResults) {
                this.cupResults = this._cupResults.filter((result: ICupResult) => {
                    return result.Nat.toLowerCase().indexOf(val) > -1 || result.Name.toLowerCase().indexOf(val) > -1;
                }); 
            }
        }
    }
}
import { TableHelperService, Seasons, Menus, StatItems } from '../services/services';
import { IStatItem, ISeason } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisStatistics(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        seasonId: '=?'
    },
    template: `
    <abris-topbar>
        <abris-navbar-toggle></abris-navbar-toggle>
        <span flex translate>{{statisticsVm.season.Description}}</span>
    </abris-topbar>
    <md-content>
        <md-card ng-if="!statisticsVm.mobile">
            <md-table-container>
                <table md-table md-row-select='false' ng-model='statisticsVm.selected' md-progress='statisticsVm.promise'>
                    <thead md-head md-order='statisticsVm.query.order' md-on-reorder='statisticsVm.onReorder'>
                        <tr md-row>
                            <th md-column md-order-by='ShortDescription'><span translate>STATISTIC</span></th>
                        </tr>
                    </thead>
                    <tbody md-body>
                        <tr md-row ng-repeat='statItem in statisticsVm.itemsForSelectedCategory() track by statItem.StatisticId' ui-sref="app.statisticDefault({seasonId: statisticsVm.seasonId, statisticId: statItem.StatisticId})">
                            <td md-cell>{{::statItem.ShortDescription}}</td>
                        </tr>
                    </tbody>
                </table>
            </md-table-container>
        </md-card>
        
        <md-card-list ng-if="statisticsVm.mobile">
            <md-card class="list-item" ng-repeat="statItem in statisticsVm.itemsForSelectedCategory() track by statItem.StatisticId"  ui-sref="app.statisticDefault({seasonId: statisticsVm.seasonId, statisticId: statItem.StatisticId})">
                <div layout="row" layout-align="center center">
                    <div  flex>{{::statItem.ShortDescription}}</div>
                </div>
            </md-card>
        </md-card-list>
    </md-content>
    `,
    controller: StatisticsController,
    controllerAs: 'statisticsVm',
    bindToController: true
  };

}

/** @ngInject */
export class StatisticsController extends TableBaseController<IStatItem> {
    
    statItemsWC: Array<IStatItem>;
    statItemsWCH: Array<IStatItem>;
    seasonId: string;
    season: ISeason;
    mobile: string;
    desktop: string;
    
    constructor(
        TableHelperService: TableHelperService,
        StatItems: StatItems,
        private Seasons: Seasons,
        private Menus: Menus,
        private NavbarState: NavbarState,
        private $state: angular.ui.IStateService,
        private screenSize: any) {
        
        super(TableHelperService, 'statistics');
        
        this.seasonId = this.seasonId || this.$state.params['seasonId'];
        
        this.promise = StatItems.getList().then((data) => {
            this.statItemsWC = data.filter((statItem: IStatItem) => {
                return statItem.Category === 'WC';
            });
            
            this.statItemsWCH = data.filter((statItem: IStatItem) => {
                return statItem.Category === 'WCH';
            });
        });
        
        this.Seasons.get(this.seasonId).then((season: ISeason) => {
            this.season = season;
        });
        
        this.Menus.Stats(this.seasonId).then((items: Array<any>) => {
            this.NavbarState.items = items;
        });
        
        this.setSizeListeners();
    }
    
    itemsForSelectedCategory(){
        return this.statItemsWC;
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
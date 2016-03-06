import { Athletes, TableHelperService, Seasons, Menus } from '../services/services';
import { IAthlete, ISeason } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisAthletes(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
    <abris-topbar>
        <abris-navbar-toggle></abris-navbar-toggle>
        
        <span ng-if="!athletesVm.searchMode" flex translate>ATHLETES</span>
        
        <abris-input-search ng-model="athletesVm.searchText" ng-class="{flex: athletesVm.searchMode}" search-mode="athletesVm.searchMode"></abris-input-search>
    </abris-topbar>

    <!-- <abris-athlete athlete="athletesVm.athlete"></abris-athlete> -->
    <md-content>   
    <md-card ng-if="!athletesVm.mobile">
        <md-table-container>
            <table md-table md-row-select='false' ng-model='athletesVm.selected' md-progress='athletesVm.promise'>
                <thead md-head md-order='athletesVm.query.order' md-on-reorder='athletesVm.onReorder'>
                    <tr md-row>
                        <th md-column md-order-by='FamilyName'><span translate>NAME</span></th>
                        <th md-column md-order-by='NAT'><span translate>NATIONALITY</span></th>
                        <th md-column md-order-by='Age'><span translate>AGE</span></th>
                        <th md-column md-order-by='Functions'><span translate>ROLE</span></th>
                    </tr>
                </thead>
                <tbody md-body>
                    <tr md-row ng-repeat='athlete in athletesVm.athletes track by athlete.IBUId' ng-click="athletesVm.openDetails(athlete)">
                        <td md-cell>
                            <abris-avatar ibuid="athlete.IBUId"></abris-avatar>
                            {{::athlete.FamilyName}} {{::athlete.GivenName}}
                        </td>
                        <td md-cell>
                            <abris-flag country-code="{{::athlete.NAT}}">
                        </td>
                        <td md-cell>
                            {{::athlete.Age}}
                        </td>
                        <td md-cell>
                            {{::athlete.Functions}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </md-table-container>
    </md-card>
    
    <md-card-list ng-if="athletesVm.mobile">
        <md-card class="list-item fade" ng-repeat="athlete in athletesVm.athletes track by athlete.IBUId" ng-click="athletesVm.openDetails(athlete)">
            <div layout="row" layout-align="start center" layout-padding>
                <abris-avatar ibuid="athlete.IBUId"></abris-avatar>
                <span flex>{{::athlete.FamilyName}} {{::athlete.GivenName}}</span>
                <abris-flag country-code="{{::athlete.NAT}}">
            </div>
        </md-card>
    </md-card-list>
    </md-content>
    `,
    controller: AthletesController,
    controllerAs: 'athletesVm',
    bindToController: true
  };

}

/** @ngInject */
export class AthletesController extends TableBaseController<IAthlete> {
    
    athletes: Array<IAthlete>;
    mobile: string;
    desktop: string;
    searchMode: boolean = false;
    athlete = {
        Age: 26,
        Birthdate: "1989-07-24T00:00:00",
        FamilyName: "LINDSTROEM",
        Functions: "Athlete",
        GenderId: "M",
        GivenName: "Fredrik",
        IBUId: "BTSWE12407198901",
        NAT: "SWE",
        NF: "SWE"
    }
    constructor(
        TableHelperService: TableHelperService,
        private Athletes: Athletes,
        private Seasons: Seasons,
        private Menus: Menus,
        private NavbarState: NavbarState,
        private $state: angular.ui.IStateService,
        private screenSize: any,
        private $scope: any,
        private $mdDialog: any) {
        
        super(TableHelperService, 'athletes');
        
        $scope.$watch('athletesVm.searchText', (val: string) => this.search(val));
        
        this.promise = this.Athletes.getList('', '').then((data) => {
            this.athletes = data;
        });
        
        this.setSizeListeners();
    }
    
    search(text) {
        if(angular.isDefined(text)) {
            this.promise = this.Athletes.getList('', text).then((data) => {
                this.athletes = data;
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
    
    openDetails(athlete: IAthlete) {
        this.$mdDialog.showAbrisComponentDialog({
            componentName: 'abrisAthlete',
            title: athlete.GivenName + ' ' + athlete.FamilyName,
            params: {
                athlete: athlete
            },
            fullscreen: true
        });
    }
}
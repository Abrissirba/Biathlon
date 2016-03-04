import { Results, ImageService, TableHelperService, Competitions } from '../../services/services';
import { IResult, IRelayResult, ICompetition } from '../../models/models';
import { TableBaseController } from '../TableBaseComponent';
import { NavbarState } from '../navbar/navbarState';

/** @ngInject */
export function abrisResultsPage(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <abris-topbar>
            <abris-navbar-toggle></abris-navbar-toggle>
            
            <span ng-show="!resultsPageVm.searchMode">{{resultsPageVm.competition.ShortDescription}}</span>
            
            <span ng-show="resultsPageVm.searchMode" layout="row">
                <md-icon class="material-icons">search</md-icon>
                <md-input-container layout="row">
                    <input ng-model="resultsPageVm.searchString" abris-focus="resultsPageVm.searchFieldFocus">
                </md-input-container>
            </span>
            
            <div flex></div>
            
            <md-button class="md-icon-button" aria-label="Favorite" ng-click="resultsPageVm.searchMode = true; resultsPageVm.searchFieldFocus();" ng-if="!resultsPageVm.searchMode">
                <md-icon class="material-icons">search</md-icon>
            </md-button>
            <md-button class="md-icon-button" aria-label="Favorite" ng-click="resultsPageVm.searchMode = false" ng-if="resultsPageVm.searchMode">
                <md-icon class="material-icons">close</md-icon>
            </md-button>
            
            <md-menu>
                <md-button class="md-icon-button" aria-label="More" ng-click="$mdOpenMenu($event)">
                    <md-icon md-menu-origin class="material-icons">filter_list</md-icon>
                </md-button>
                <md-menu-content>
                    <md-menu-item ng-repeat="item in resultsPageVm.orderProps">
                        <md-button ng-click="resultsPageVm.onReorder(item.key)">
                            {{item.title | translate}}
                        </md-button>
                    </md-menu-item>
                </md-menu-content>
            </md-menu>
        </abris-topbar>
        <md-content>
            <abris-results search-string="resultsPageVm.searchString"></abris-results>
        </md-content>
    `,
    controller: ResultsPageController,
    controllerAs: 'resultsPageVm',
    bindToController: true
  };

}

/** @ngInject */
export class ResultsPageController {
    seasonId: string;
    eventId: string;
    raceId: string;
    competition: ICompetition;
    searchString = "";
    
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
        title: 'SHOOTINGS',
        key: 'Shootings'
    }];
    
    constructor(
        private Results: Results,
        private $state: angular.ui.IStateService,
        private $scope: angular.IScope,
        private NavbarState: NavbarState,
        private Competitions: Competitions) {
                
        this.seasonId = this.$state.params['seasonId'];
        this.eventId = this.$state.params['eventId'];
        this.raceId = this.$state.params['raceId'];
        
        this.Competitions.getList(this.eventId).then((competitions: Array<ICompetition>) => {
            competitions.forEach((competition: ICompetition) => {
                if (competition.RaceId === this.raceId) {
                    this.competition = competition; 
                }
            });
        });
        
        this.Competitions.getList(this.eventId).then((competitions: Array<ICompetition>) => {
            var items = [];
            competitions.forEach((competition: ICompetition) => {
                items.push({
                   title: competition.ShortDescription,
                   active: competition.RaceId === this.raceId,
                   state: 'app.results({seasonId: "' + this.seasonId + '", eventId: "' + this.eventId + '", raceId: "' + competition.RaceId + '"})'
                });
            });
            this.NavbarState.items = items;
        });
        
       
        
    }
}
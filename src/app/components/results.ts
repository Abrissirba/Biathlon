import { Results, ImageService, TableHelperService } from '../services/services';
import { IResult, IRelayTeamResult } from '../models/models';
import { TableBaseController } from './TableBaseComponent';

/** @ngInject */
export function abrisResults(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
   <!-- <md-card>
        <md-toolbar class="md-table-toolbar md-default">
            <div class="md-toolbar-tools">
                <span translate>COMPETITION_DETAILS</span>
            </div>
        </md-toolbar>
        <md-table-container>
            <table md-table md-row-select='false' ng-model='resultsVm.selected' md-progress='resultsVm.promise'>
                <thead md-head md-order='resultsVm.query.order' md-on-reorder='resultsVm.onReorder'>
                <tr md-row>
                    <th md-column md-numeric md-order-by='Rank' style="width: 5%"><span translate>RANK</span></th>
                    <th md-column md-order-by='Name' style="width: 50%"><span translate>NAME</span></th>
                    <th md-column md-order-by='Nat' style="width: 10%"><span translate>NAT</span></th>
                    <th md-column md-order-by='Shootings' style="width: 10%"><span translate>SHOOTING</span></th>
                    <th md-column md-order-by='ShootingTotal' style="width: 5%"><span translate>TOTAL</span></th>
                    <th md-column md-order-by='TotalTime' style="width: 10%"><span translate>TIME</span></th>
                    <th md-column md-order-by='Behind' style="width: 5%"><span translate>BEHIND</span></th>
                </tr>
                </thead>
                <tbody md-body>
                <tr md-row ng-repeat='result in resultsVm.results'>
                    <td md-cell>{{resultsVm.getRank(result)}}</td>
                    <td md-cell><img class="md-avatar" ng-src="{{resultsVm.getAvatarUrl(result)}}"></img>{{result.Name}}</td>
                    <td md-cell><abris-flag md-whiteframe="3" country-code="{{result.Nat}}"></abris-flag></td>
                    <td md-cell>{{result.Shootings}}</td>
                    <td md-cell>{{result.ShootingTotal}}</td>
                    <td md-cell>{{result.TotalTime}}</td>
                    <td md-cell>{{result.Behind}}</td>
                </tr>
                </tbody>
            </table>
        </md-table-container>
    </md-card> -->
    
    <abris-topbar title="'Results'">
        <md-button class="md-icon-button" aria-label="Favorite">
          <md-icon class="material-icons">search</md-icon>
        </md-button>
        <md-button class="md-icon-button" aria-label="More">
          <md-icon class="material-icons">filter_list</md-icon>
        </md-button>
    </abris-topbar>
    
    <md-card-list>
        <md-card class="list-item" ng-repeat="result in resultsVm.results" ng-if="resultsVm.results">
            <div layout="row" layout-align="center center">
                <div class="md-subhead">{{resultsVm.getRank(result)}}</div>
                <div class="no-padding"><img class="md-avatar" ng-src="{{resultsVm.getAvatarUrl(result)}}"></img></div>
                <div>{{result.Name}}</div>
                <div class="no-padding" flex layout="row" layout-align="end center">
                    <abris-flag md-whiteframe="3" country-code="{{result.Nat}}"></abris-flag>
                </div>
            </div>
            <div layout="row" style="padding-top: 0">
                <div layout="column">
                    <div class="md-caption">Shootings</div>
                    <div class="">{{result.Shootings}}</div>
                </div>
                <div layout="column">
                    <div class="md-caption">Total Time</div>
                    <div class="">{{result.TotalTime}}</div>
                </div>
                <div layout="column">
                    <div class="md-caption">Behind</div>
                    <div class="">{{result.Behind}}</div>
                </div>
            </div>
        </md-card>
        
        <md-card class="list-item" ng-repeat="result in resultsVm.relayResults" ng-if="resultsVm.relayResults">
            <div layout="row" layout-align="center center">
                <div class="md-subhead">{{resultsVm.getRank(result.teamResult)}}</div>
                <div>{{result.teamResult.Name}}</div>
                <div class="no-padding" flex layout="row" layout-align="end center">
                    <abris-flag md-whiteframe="3" country-code="{{result.teamResult.Nat}}"></abris-flag>
                </div>
            </div>
            <div layout="row" style="padding-top: 0">
                <div layout="column">
                    <div class="md-caption">Shootings</div>
                    <div class="">{{result.teamResult.Shootings}}</div>
                </div>
                <div layout="column">
                    <div class="md-caption">Total Time</div>
                    <div class="">{{result.teamResult.TotalTime}}</div>
                </div>
                <div layout="column">
                    <div class="md-caption">Behind</div>
                    <div class="">{{result.teamResult.Behind}}</div>
                </div>
            </div>
            
            <span class="individual-results">
                <div class="list-item" ng-repeat="result in result.individualResults">
                    <div layout="row" layout-align="center center">
                        <div class=""><img class="md-avatar" ng-src="{{resultsVm.getAvatarUrl(result)}}"></img></div>
                        <div flex>{{result.Name}}</div>
                    </div>
                    <div layout="row" style="padding-top: 0">
                        <div layout="column">
                            <div class="md-caption">Shootings</div>
                            <div class="">{{result.Shootings}}</div>
                        </div>
                        <div layout="column">
                            <div class="md-caption">Total Time</div>
                            <div class="">{{result.TotalTime}}</div>
                        </div>
                        <div layout="column">
                            <div class="md-caption">Behind</div>
                            <div class="">{{result.Behind}}</div>
                        </div>
                    </div>
                </div>
            </span>

        </md-card>
        
       
    </md-card-list>
    `,
    controller: ResultsController,
    controllerAs: 'resultsVm',
    bindToController: true
  };

}

/** @ngInject */
export class ResultsController extends TableBaseController<IResult> {
    
    results: Array<IResult>;
    relayResults: Array<IRelayTeamResult>;
    raceId: string;
    
    constructor(
        TableHelperService: TableHelperService,
        Results: Results,
        private $state: angular.ui.IStateService,
        private ImageService: ImageService) {
        
        super(TableHelperService, 'results', {order: 'Rank'});
        
        this.raceId = this.$state.params['raceId'];
        
        this.promise = Results.getList(this.raceId).then((data) => {
            if (angular.isDefined(data[0].Leg) && data[0].Leg !== null) {
               this.relayResults = Results.parseRelayData(data);
            }
            else {
                this.results = data;
                this.order(data);
            }
        });
    }
    
    getAvatarUrl(result: IResult){
        return this.ImageService.getImageUrl(result.IBUId);
    }
    
    getRank(result: IResult){
        if(result.Rank < 990){
            return result.Rank.toString();
        }
        else if(result.IRM){
            return result.IRM;
        }
        return '';
    }
}
import { Results, ImageService, TableHelperService } from '../services/services'
import { IResult } from '../models/models'
import { TableBaseController } from './TableBaseComponent'

/** @ngInject */
export function abrisResults(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
    <md-card>
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
                    <td md-cell>{{result.Nat}} <flag country="{{result.Nat.toLowerCase()}}"></flag></td>
                    <td md-cell>{{result.Shootings}}</td>
                    <td md-cell>{{result.ShootingTotal}}</td>
                    <td md-cell>{{result.TotalTime}}</td>
                    <td md-cell>{{result.Behind}}</td>
                </tr>
                </tbody>
            </table>
        </md-table-container>
    </md-card>
    `,
    controller: ResultsController,
    controllerAs: 'resultsVm',
    bindToController: true
  };

}

/** @ngInject */
export class ResultsController extends TableBaseController<IResult> {
    
    results: Array<IResult>;
    raceId: string;
    
    constructor(
        TableHelperService: TableHelperService,
        Results: Results,
        private $state: angular.ui.IStateService,
        private ImageService: ImageService) {
        
        super(TableHelperService, 'results', {order: 'Rank'});
        
        this.raceId = this.$state.params['raceId'];
        
        this.promise = Results.getList(this.raceId).then((data) => {
            data.forEach((result) => {
                result.Rank = parseInt(<any>result.Rank);
                if(isNaN(result.Rank)){
                    switch(result.IRM){
                        case 'DNF':
                            result.Rank = 997;
                            break;
                        case 'DSQ':
                            result.Rank = 998;
                            break;
                        case 'DNS':
                            result.Rank = 999;
                            break;
                    }
                }
            });
            
            this.results = data;
            this.order(data);
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
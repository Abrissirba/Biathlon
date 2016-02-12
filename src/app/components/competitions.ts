import { Competitions, TableHelperService } from '../services/services'
import { ICompetition } from '../models/models'
import { TableBaseController } from './TableBaseComponent'

/** @ngInject */
export function abrisCompetitions(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
    <!-- <md-card>
        <md-toolbar class="md-table-toolbar md-default">
            <div class="md-toolbar-tools">
                <span translate>EVENT_DETAILS</span>
            </div>
        </md-toolbar>
        <md-table-container>
            <table md-table md-row-select='false' ng-model='competitionsVm.selected' md-progress='competitionsVm.promise'>
                <thead md-head md-order='competitionsVm.query.order' md-on-reorder='competitionsVm.onReorder'>
                <tr md-row>
                    <th md-column md-order-by='StartTime'><span translate>DATE</span></th>
                    <th md-column md-order-by='StartTime'><span translate>TIME</span></th>
                    <th md-column md-order-by='Description'><span translate>COMPETITION</span></th>
                    <th md-column md-order-by='StatusId'><span translate>STATUS</span></th>
                </tr>
                </thead>
                <tbody md-body>
                <tr md-row ng-repeat='competition in competitionsVm.competitions' ui-sref="app.results({raceId: competition.RaceId})">
                    <td md-cell>{{competition.StartTime | date : 'dd MMM yyyy' : timezone}}</td>
                    <td md-cell>{{competition.StartTime | date : 'HH:mm' : timezone}}</td>
                    <td md-cell>{{competition.Description}}</td>
                    <td md-cell>{{competition.StatusText}}</td>
                </tr>
                </tbody>
            </table>
        </md-table-container>
    </md-card> -->
    
    <md-card-list>
        <md-card class="list-item" ng-repeat="competition in competitionsVm.competitions"  ui-sref="app.results({raceId: competition.RaceId})">
            <div layout="row" layout-align="center center">
                <div class="md-caption">{{competition.StartTime | date : 'dd MMM yyyy' : timezone}}</div>
                <div class="md-caption" flex>{{competition.StartTime | date : 'HH:mm' : timezone}}</div>
            </div>
            <div layout="row">
                <div class="md-subhead">{{competition.Description}}</div>
            </div>
        </md-card>
    </md-card-list>
    `,
    controller: CompetitionsController,
    controllerAs: 'competitionsVm',
    bindToController: true
  };

}

/** @ngInject */
export class CompetitionsController extends TableBaseController<ICompetition> {
    
    competitions: Array<ICompetition>;
    eventId: string;
    
    constructor(
        TableHelperService: TableHelperService,
        Competitions: Competitions,
        private $state: angular.ui.IStateService) {
        
        super(TableHelperService, 'competitions');
        
        this.eventId = this.$state.params['eventId'];
        
        this.promise = Competitions.getList(this.eventId).then((data) => {
            this.competitions = data;
        });
    }
}
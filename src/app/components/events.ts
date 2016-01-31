import { Events, TableHelperService } from '../services/services'
import { IEvent } from '../models/models'
import { TableBaseController } from './TableBaseComponent'

/** @ngInject */
export function abrisEvents(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <md-table-container>
            <table md-table md-row-select='false' ng-model='eventVm.selected' md-progress='eventVm.promise'>
                <thead md-head md-order='eventVm.query.order' md-on-reorder='eventVm.onReorder'>
                <tr md-row>
                    <th md-column md-order-by='StartDate'>StartDate</th>
                    <th md-column md-order-by='Description'>Event</th>
                    <th md-column md-order-by='Organizer'>Place</th>
                    <th md-column md-order-by='Nat'>Country</th>
                </tr>
                </thead>
                <tbody md-body>
                <tr md-row ng-click='eventVm.open(event, $event)' ng-repeat='event in eventVm.events'>
                    <td md-cell>{{event.StartDate}}</td>
                    <td md-cell>{{event.Description}}</td>
                    <td md-cell>{{event.Organizer}}</td>
                    <td md-cell>{{event.Nat}}</td>
                </tr>
                </tbody>
            </table>
        </md-table-container>
    `,
    controller: EventController,
    controllerAs: 'eventVm',
    bindToController: true
  };

}

/** @ngInject */
export class EventController extends TableBaseController<IEvent> {
    
    events: Array<IEvent>;
    
    constructor(
        TableHelperService: TableHelperService,
        Events: Events) {
        
        super(TableHelperService, 'events');
        
        this.promise = Events.getList("").then((data) => {
            this.events = data;
        });
    }
}
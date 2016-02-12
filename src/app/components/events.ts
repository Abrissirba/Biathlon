import { Events, TableHelperService } from '../services/services'
import { IEvent } from '../models/models'
import { TableBaseController } from './TableBaseComponent'

/** @ngInject */
export function abrisEvents(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
    <!-- <md-card>
        <md-toolbar class="md-table-toolbar md-default">
            <div class="md-toolbar-tools">
                <span translate>EVENT_SCHEDULE</span>
            </div>
        </md-toolbar>
        <md-table-container>
            <table md-table md-row-select='false' ng-model='eventsVm.selected' md-progress='eventsVm.promise'>
                <thead md-head md-order='eventsVm.query.order' md-on-reorder='eventsVm.onReorder'>
                <tr md-row>
                    <th md-column md-order-by='StartDate'><span translate>DATE</span></th>
                    <th md-column md-order-by='Description'><span translate>EVENT</span></th>
                    <th md-column md-order-by='Organizer'><span translate>PLACE</span></th>
                    <th md-column md-order-by='Nat'><span translate>COUNTRY</span></th>
                </tr>
                </thead>
                <tbody md-body>
                <tr md-row ng-repeat='event in eventsVm.events' ui-sref="app.competitions({eventId: event.EventId})">
                    <td md-cell>{{event.StartDate | date : 'dd MMM yyyy' : timezone}}</td>
                    <td md-cell>{{event.Description}}</td>
                    <td md-cell>{{event.Organizer}}</td>
                    <td md-cell>{{event.Nat}}</td>
                </tr>
                </tbody>
            </table>
        </md-table-container>
    </md-card> -->
    
    <md-card-list>
        <md-card class="list-item" ng-repeat="event in eventsVm.events"  ui-sref="app.competitions({eventId: event.EventId})">
            <div layout="row" layout-align="center center">
                <div>
                    <abris-flag  md-whiteframe="3" country-code="{{event.Nat}}"></abris-flag>
                </div>
                <div class="md-subhead">{{event.Organizer}}</div>
                <div class="md-caption" flex>{{event.StartDate | date : 'dd MMM yyyy' : timezone}}</div>
            </div>
            <div layout="row" style="padding-top: 4px;">
                <div>{{event.Description}}</div>
            </div>
        </md-card>
    </md-card-list>
    `,
    controller: EventsController,
    controllerAs: 'eventsVm',
    bindToController: true
  };

}

/** @ngInject */
export class EventsController extends TableBaseController<IEvent> {
    
    events: Array<IEvent>;
    
    constructor(
        TableHelperService: TableHelperService,
        Events: Events,
        private $state: angular.ui.IStateService) {
        
        super(TableHelperService, 'events');
        
        this.promise = Events.getList("1516").then((data) => {
            this.events = data;
        });
    }
    
    getLink(event: IEvent){
        return "";
    }
}
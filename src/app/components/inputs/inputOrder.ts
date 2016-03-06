import { ImageService } from '../../services/services';

/** @ngInject */
export function abrisInputOrder(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        onReorder: '=',
        items: '='
    },
    template: `
        <md-menu>
            <md-button class="md-icon-button" aria-label="More" ng-click="$mdOpenMenu($event)">
                <md-icon md-menu-origin class="material-icons">filter_list</md-icon>
            </md-button>
            <md-menu-content>
                <md-menu-item ng-repeat="item in inputOrderVm.items">
                    <md-button ng-click="inputOrderVm.onReorder(item.key)">
                        {{::item.title | translate}}
                    </md-button>
                </md-menu-item>
            </md-menu-content>
        </md-menu>
    `,
    controller: InputOrderController,
    controllerAs: 'inputOrderVm',
    bindToController: true
  };

}

/** @ngInject */
export class InputOrderController {
    
    onReorder: any;
    items: Array<any>;
    
    constructor() {
        
    }
        
}

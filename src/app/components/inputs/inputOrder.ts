import { ImageService } from '../../services/services';

/** @ngInject */
export function abrisInputFilter(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        onReorder: '=',
        orderItems: '=',
        filterItems: '=',
    },
    template: `
        <md-menu class="abris-input-filter">
            <md-button class="md-icon-button" aria-label="More" ng-click="$mdOpenMenu($event)">
                <md-icon md-menu-origin class="material-icons">filter_list</md-icon>
            </md-button>
            <md-menu-content class="abris-input-filter">
                <md-menu-item ng-repeat="item in inputFilterVm.orderItems">
                    <md-button ng-click="inputFilterVm.onOrderClick(item)">
                        {{item.title | translate}}
                    </md-button>
                </md-menu-item>
                <md-divider ng-if="inputFilterVm.filterItems.length > 0"></md-divider>
                <md-menu-item ng-repeat="item in inputFilterVm.filterItems" ng-class="{active: item.active}">
                    <md-button ng-click="inputFilterVm.onFilterClick(item, $event)">
                        {{item.title | translate}}
                    </md-button>
                </md-menu-item>
            </md-menu-content>
        </md-menu>
    `,
    controller: InputFilterController,
    controllerAs: 'inputFilterVm',
    bindToController: true
  };

}

/** @ngInject */
export class InputFilterController {
    
    onReorder: any;
    orderItems: Array<any>;
    filterItems: Array<any>;
    
    constructor() {
        
    }
    
    onOrderClick(item: any) {
        if (item.callback) {
           item.callback(item); 
        }
        else if (this.onReorder) {
            this.onReorder(item.key);
        }
    }
    
    onFilterClick(item: any, ev: MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        
        item.active = !item.active;
        if (item.callback) {
            item.callback(item);
        }
    }
}

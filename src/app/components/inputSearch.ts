import { ImageService } from '../services/services';

/** @ngInject */
export function abrisInputSearch(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        searchText: '=ngModel',
        searchMode: '='
    },
    replace: true,
    template: `
        <div class="input-search" flex layout="row" layout-align="start center">
            <md-button class="md-icon-button" ng-if="inputSearchVm.searchMode" ng-click="inputSearchVm.close()">
                <md-icon class="material-icons" >arrow_back</md-icon>
            </md-button>
            
            <md-input-container md-no-float ng-show="inputSearchVm.searchMode" flex>
                <input type="text" placeholder="SEARCH" ng-model="inputSearchVm.searchText" ng-model-options="{ debounce: 300 }" abris-focus="inputSearchVm.searchFieldFocus" />
            </md-input-container>
            
            <md-button class="md-icon-button" ng-if="!inputSearchVm.searchMode" ng-click="inputSearchVm.open()">
                <md-icon class="material-icons" >search</md-icon>
            </md-button>
            <md-button class="md-icon-button" ng-if="inputSearchVm.searchMode" ng-click="inputSearchVm.reset()">
                <md-icon class="material-icons">close</md-icon>
            </md-button>
        </div>
    `,
    controller: InputSearchController,
    controllerAs: 'inputSearchVm',
    bindToController: true
  };

}

/** @ngInject */
export class InputSearchController {
    
    searchText: string;
    searchMode: boolean;
    searchFieldFocus: any;
    
    constructor(private ImageService: ImageService) {
        
    }
    
    open() {
        this.searchMode = true;
        this.searchFieldFocus();
    }
    
    close() {
        this.searchText = '';
        this.searchMode = false;
    }
    
    reset() {
        this.searchText = '';
        this.searchFieldFocus();
    }
    
}

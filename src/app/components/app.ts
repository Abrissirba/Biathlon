import { Athletes, Bios, Competitions } from '../services/services'

/** @ngInject */
export function abrisApp(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <div layout="row" layout-fill>
            <abris-navbar>
            
            </abris-navbar>
            <div ui-view layout="column" flex></div>
        </div>
    `,
    controller: AppController,
    controllerAs: 'appVm',
    bindToController: true
  };

}

/** @ngInject */
export class AppController {
    constructor() {
        
    }
}

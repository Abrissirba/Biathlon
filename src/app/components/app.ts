import { Athletes, Bios, Competitions } from '../services/services'

/** @ngInject */
export function abrisApp(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <div layout="row">
            <abris-navbar>
            
            </abris-navbar>
            <abris-analysis></abris-analysis>
            <!-- <abris-events></abris-events> -->
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

import { NavbarState } from './navbarState';

/** @ngInject */
export function abrisTopbar(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <md-toolbar class='md-primary'>
            <div class='md-toolbar-tools'>
                <div flex>
                    <ng-transclude class="topbar-tools" layout="row" layout-align="center center"></ng-transclude>
                </div>
            </div>
        </md-toolbar>
    `,
    controller: TopbarController,
    controllerAs: 'topbarVm',
    bindToController: true,
    transclude: true
  };


}

/** @ngInject */
export class TopbarController {

    constructor(private NavbarState: NavbarState) {
        
    }
    
}

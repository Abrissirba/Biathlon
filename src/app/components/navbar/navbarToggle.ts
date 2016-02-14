import { NavbarState } from './navbarState';

/** @ngInject */
export function abrisNavbarToggle(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <md-button class='md-icon-button' aria-label='Menu' ng-click="navbarToggleVm.toggleNavbar()" hide-gt-md>
            <md-icon md-font-library='material-icons'>menu</md-icon>
        </md-button>
    `,
    controller: NavbarToggleController,
    controllerAs: 'navbarToggleVm',
    bindToController: true
  };


}

/** @ngInject */
export class NavbarToggleController {

    constructor(private NavbarState: NavbarState) {
        
    }

    toggleNavbar() {
        this.NavbarState.toggleNavbar();
    }
}

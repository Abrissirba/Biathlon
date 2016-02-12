import { NavbarState } from './navbarState';

/** @ngInject */
export function abrisTopbar(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
      title: '=' 
    },
    replace: true,
    template: `
        <md-toolbar class='md-primary'>
            <div class='md-toolbar-tools'>
                <md-button class='md-icon-button' aria-label='Menu' ng-click="topbarVm.toggleNavbar()" hide-gt-md>
                    <md-icon md-font-library='material-icons'>menu</md-icon>
                </md-button>
                <span>{{topbarVm.title | translate}}</span>
                <span flex></span>
                <ng-transclude class="topbar-tools"></ng-transclude>
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

    toggleNavbar() {
        this.NavbarState.toggleNavbar();
    }
}

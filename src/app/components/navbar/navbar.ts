import { NavbarState } from './navbarState';

/** @ngInject */
export function abrisNavbar(): angular.IDirective {

  return {
    restrict: 'E',
    transclude: true,
    template: `
        <md-sidenav class='md-sidenav-left md-whiteframe-z2' md-component-id='navbar' md-is-locked-open='$mdMedia("gt-md")'>
            <md-toolbar class='md-theme-indigo'>
                <h1 class='md-toolbar-tools md-clickable' ui-sref='app'>Biathlon</h1>
            </md-toolbar>

            <ng-transclude></ng-transclude>

        </md-sidenav>
    `,
    controller: NavbarController,
    controllerAs: 'navbarVm',
    bindToController: true
  };


}

/** @ngInject */
export class NavbarController {
    
    constructor(
        private $mdSidenav: angular.material.ISidenavService, 
        private NavbarState: NavbarState) {
        
    }
    
    toggleNavbar() {
        this.$mdSidenav('navbar').toggle();
    }
}
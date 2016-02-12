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
            
                <md-button ui-sref='{{ item.state }}' ng-repeat="item in navbarVm.items" md-ink-ripple>
                    <div layout="row">
                        <md-icon md-font-library='material-icons'>{{item.icon}}</md-icon>
                        <span>{{ item.title | translate }}</span>
                        <span flex></span>
                    </div>
                </md-button>
  
        </md-sidenav>
    `,
    controller: NavbarController,
    controllerAs: 'navbarVm',
    bindToController: true
  };


}

/** @ngInject */
export class NavbarController {
    
    items: Array<any> = [{
        title: "SCHEDULE_AND_RESULTS",
        state: 'app.schedule'
    },{
        title: "CUPS",
        state: 'app.cups'
    },{
        title: "ATHLETES",
        state: 'app.athletes'
    },{
        title: "STATISTICS",
        state: 'app.stats'
    }]
    
    constructor(
        private $mdSidenav: angular.material.ISidenavService, 
        private NavbarState: NavbarState) {
        NavbarState.setNavbar(this);
    }
    
    toggleNavbar() {
        this.$mdSidenav('navbar').toggle();
    }
}
import { NavbarState } from './navbarState';

/** @ngInject */
export function abrisNavbar(): angular.IDirective {

  return {
    restrict: 'E',
    transclude: true,
    template: `
        <md-sidenav class='md-sidenav-left md-whiteframe-z2' md-component-id='navbar' md-is-locked-open='$mdMedia("gt-md")'>
            <!-- <md-toolbar class='md-theme-indigo' layout="row" layout-align="start center">
                <md-button flex ui-sref='app.home' ng-click="navbarVm.toggleNavbar()">
                    <div layout="row" layout-align="center center">
                        <md-icon md-font-library='material-icons'>home</md-icon>
                        <div class='md-clickable'></div>
                        <span flex></span>
                    </div>
                </md-button>
            </md-toolbar> -->
            
            <header>
                <a class="md-button" ui-sref="app.home" ng-click="navbarVm.toggleNavbar()" layout="column" layout-align="center center">
                    <img src="http://v4m-cdn.juniper.it/x00001/public/B2FCFB5BAC8E400699AC169476649EDB/Vortex4/68C746AFCB334997A614B555CDAC9C35.jpg" />
                    <div class="md-headline">Biathlon Data</div>
                </a>
            </header>


            <ng-transclude></ng-transclude>
            <md-content>
            <div layout="column" class="navbar-items">
            
                <md-button class="navbar-back" ng-click="navbarVm.goBack()" ng-if="navbarVm.canGoBack()">
                    <div layout="row" layout-align="start center" flex >
                        <md-icon md-font-library='material-icons'>arrow_back</md-icon>
                        <span translate>BACK</span>
                        <span flex></span>
                    </div>
                </md-button>
            
                <md-button ui-sref='{{ item.state }}' ng-class="{active: item.active}" ng-click="navbarVm.toggleNavbar()" ng-repeat="item in navbarVm.items track by $id(item)" md-no-ink>
                    <div layout="row">
                        <!-- <md-icon md-font-library='material-icons'>{{item.icon}}</md-icon> -->
                        <span>{{ item.title | translate }}</span>
                        <span flex></span>
                    </div>
                </md-button>
            </div>
            </md-content>
        </md-sidenav>
    `,
    controller: NavbarController,
    controllerAs: 'navbarVm',
    bindToController: true
  };


}

/** @ngInject */
export class NavbarController {
    
    items: Array<any>;
    
    constructor(
        private $mdSidenav: angular.material.ISidenavService, 
        private NavbarState: NavbarState) {
            
        NavbarState.setNavbar(this);
        NavbarState.registerItemsUpdatedCallback((items: Array<any>) => this.itemsUpdated(items));
    }
    
    toggleNavbar() {
        this.$mdSidenav('navbar').toggle();
    }
    
    itemsUpdated(items: Array<any>) {
        this.items = items;
    }
    
    goBack() {
        this.toggleNavbar();
        this.NavbarState.goToPreviousState();
    }
    
    canGoBack() {
        return this.NavbarState.canGoBack();
    }
}
import { NavbarState } from './navbarState';

/** @ngInject */
export function abrisNavbar(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <md-sidenav class='md-sidenav-left md-whiteframe-z2' md-component-id='navbar' md-is-locked-open='$mdMedia("gt-md")'>
            <md-toolbar class='md-theme-indigo'>
                <h1 class='md-toolbar-tools md-clickable' ui-sref='app'>Biathlon</h1>
            </md-toolbar>

            <div class='section' ng-repeat='section in navbarVm.sections' ng-class="{'open': navbarVm.isSectionOpen(section)}">
                <md-menu-item class='heading'>
                    <md-button ng-click='navbarVm.setActiveSection(section)'>
                        <md-icon class='menu' md-font-library='material-icons'>expand_more</md-icon>
                        <span>{{ section.title | translate }}</span>
                        
                    </md-button>
                </md-menu-item>
                <div class='section-items' ng-style='navbarVm.sectionHeight(section)'>
                    <md-menu-item ng-class="{'active': navbarVm.isPageActive(page)}" ng-repeat='page in section.pages'>
                        <md-button ui-sref='{{ page.state }}' md-ink-ripple='#FF0000'>
                            <md-icon md-font-library='material-icons'>{{page.icon}}</md-icon>
                            <span>{{ page.title | translate }}</span>
                            <span class='flex'></span>
                            <!-- <span class='badge'>5</span> -->
                        </md-button>
                    </md-menu-item>
                </div>
                <md-divider></md-divider>
            </div>

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
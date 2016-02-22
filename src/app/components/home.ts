import { NavbarState } from './navbar/navbarState'

/** @ngInject */
export function abrisHome(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <abris-topbar>
            <abris-navbar-toggle></abris-navbar-toggle>
            <span flex translate>HOME</span>
            <abris-language-selector></abris-language-selector>
        </abris-topbar>
    `,
    controller: HomeController,
    controllerAs: 'homeVm',
    bindToController: true
  };

}

/** @ngInject */
export class HomeController {
    
    constructor(
        private NavbarState: NavbarState) {
        
        this.NavbarState.items = [{
            title: "SCHEDULE_AND_RESULTS",
            state: 'app.schedule({seasonId: 1516})'
        }, {
            title: "STANDINGS",
            state: 'app.cups'
        }, {
            title: "ATHLETES",
            state: 'app.athletes'
        }, {
            title: "STATISTICS",
            state: 'app.stats'
        }];
    }
}

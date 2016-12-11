import { NavbarState } from './navbar/navbarState';
import { Seasons, Events, Competitions, Menus } from '../services/services';
import { ISeason, IEvent, ICompetition } from '../models/models';

/** @ngInject */
export function abrisAbout(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <abris-topbar>
            <abris-navbar-toggle></abris-navbar-toggle>
            <span flex translate>ABOUT</span>
            <abris-language-selector></abris-language-selector>
        </abris-topbar>
        <md-content>
            <md-card>
                <div layout-padding>
                    <div class="md-title">
                        IBU Datacenter
                    </div>
                    <div>
                        This website uses data from the <a href="http://biathlonresults.com" target="_blank">IBU Datacenter</a>. <br/>
                        This website have no other connections to either IBU or IBU Datacenter.
                    </div>
                </div>
                
                <div layout-padding>
                    <div class="md-title">
                        Mobile
                    </div>
                    <div>
                        <p>The reason to why I created this website was that I couldn't use the previous version of the IBU Datacenter on my mobile devices. </p>
                        <p>This website is focused on historical data and mobile devices. It doesn't include the live features available in the IBU Datacenter.</p>
                    </div>
                </div>
            </md-card>
            
        </md-content>
    `,
    controller: AboutController,
    controllerAs: 'aboutVm',
    bindToController: true
  };

}

/** @ngInject */
export class AboutController {
   smallDevice: boolean;
    
    constructor(
        private NavbarState: NavbarState,
        private Menus: Menus,
        private screenSize: any) {

        this.Menus.Home().then((items: any) => {
            this.NavbarState.items = items;
        });
    }
    
    setSizeListeners() {
        this.smallDevice = this.screenSize.is('xs, sm');
        this.screenSize.on('xs, sm', (match) =>{
            this.smallDevice = match;
        });
    }
}

import { Athletes, Bios, Competitions } from '../services/services'

/** @ngInject */
export function abrisApp(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <div layout="row ui-view-container" layout-fill>
            <abris-navbar></abris-navbar>
            <div ui-view layout="column" layout-fill flex></div>

        </div>
    `,
    controller: AppController,
    controllerAs: 'appVm',
    bindToController: true
  };

}

/** @ngInject */
export class AppController {
    xs: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    
    constructor(
        private $state: angular.ui.IStateService,
        private screenSize: any
    ) {
        if (this.$state.current.name === 'app') {
           this.$state.go('app.home'); 
        }
    }
    
    setSizeListeners() {
        this.xs = this.screenSize.on('xs', (match) =>{
            this.xs = match;
        });
        this.sm = this.screenSize.on('sm', (match) => {
            this.sm = match;
        });
        this.md = this.screenSize.on('md', (match) =>{
            this.md = match;
        });
        this.lg = this.screenSize.on('lg', (match) => {
            this.lg = match;
        });
    }
}

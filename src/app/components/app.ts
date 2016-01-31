import { Athletes, Bios, Competitions } from '../services/services'

/** @ngInject */
export function abrisApp(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <div layout="row">
            <abris-navbar></abris-navbar>
            <abris-events></abris-events>
            <div ui-view layout="column" flex></div>
        </div>
    `,
    controller: AppController,
    controllerAs: 'appVm',
    bindToController: true
  };

}

/** @ngInject */
export class AppController {
  

  constructor(
        private Athletes: Athletes,
        private Bios: Bios,
        private Competitions: Competitions) {
       
        Athletes.getList("", "").then((data) => {
            console.log(data);
        });
        
        Bios.getList("BTSWE12407198901").then((data) => {
            console.log(data);
        });
        
        Competitions.getList("BT1516SWRLCP01").then((data) => {
            console.log(data);
        });
  }
}

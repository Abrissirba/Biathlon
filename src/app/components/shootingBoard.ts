/** @ngInject */
export function abrisShootingBoard(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        value: '='
    },
    template: `
        <md-card layout="row" layout-align="space-between center">
            <span class="dot" md-whiteframe="5" ng-repeat="i in [1,2,3,4,5]" ng-class="{'hit': shootingBoardVm.isHit(i)}"></span>
        </md-card>
    `,
    controller: ShootingBoardController,
    controllerAs: 'shootingBoardVm',
    bindToController: true
  };

}

/** @ngInject */
export class ShootingBoardController {
    
    value: number;
    hits: number;
    constructor() {
        this.value = this.value ? parseInt(this.value.toString()): 0;
        this.hits = 5 - this.value;
    }
    
    isHit(index: number){
        return this.hits - index >= 0;
    }
}

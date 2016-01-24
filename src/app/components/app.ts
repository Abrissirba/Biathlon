/** @ngInject */
export function abrisApp(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <div layout="row">
            <abris-navbar></abris-navbar>
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
  

  constructor(private $http: angular.IHttpService) {
    this.$http.jsonp('http://datacenter.biathlonresults.com/modules/sportapi/api/CupResults?RT=385698&CupId=BT1516SWRLCP__SMSP&callback=JSON_CALLBACK').then((res) => {
        console.log(res.data);
    }, (err) => {
        console.log(err);
    });
  }
}

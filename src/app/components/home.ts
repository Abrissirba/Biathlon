/** @ngInject */
export function abrisHome(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <div>Hej<br/>Hej<br/>Hej<br/>Hej<br/>Hej<br/>Hej<br/></div>
    `,
    controller: HomeController,
    controllerAs: 'homeVm',
    bindToController: true
  };

}

/** @ngInject */
export class HomeController {
    
    constructor(private $http: angular.IHttpService) {
        
        this.$http.jsonp('http://datacenter.biathlonresults.com/modules/sportapi/api/CupResults?RT=385698&CupId=BT1516SWRLCP__SMSP&callback=JSON_CALLBACK').then((res) => {
            console.log(res.data);
        }, (err) => {
            console.log(err);
        });
    }
}

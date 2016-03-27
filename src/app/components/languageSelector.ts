/** @ngInject */
export function abrisLanguageSelector(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <div layout="row">
            <div ng-repeat="lang in langVm.langs" ng-click="langVm.setLanguage(lang.code)">
                <abris-flag country-code="{{lang.flag}}" layout-padding></abris-flag>
            </div>
        </div>
    `,
    controller: LanguageSelectorController,
    controllerAs: 'langVm',
    bindToController: true
  };

}

/** @ngInject */
export class LanguageSelectorController {
    
    langs = [{
        code: 'en',
        flag: 'gbr'
    },{
        code: 'de',
        flag: 'ger'
    },{
        code: 'sv',
        flag: 'swe'
    }];
    
    constructor(
        private $translate: any) {
        
    }
    
    setLanguage(langKey) {
        this.$translate.use(langKey);
        localStorage.setItem('langKey', langKey);     
    }
}

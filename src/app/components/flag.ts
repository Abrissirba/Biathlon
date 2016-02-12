import { Countries } from '../services/services';
import { ICountry } from '../models/models';

/** @ngInject */
export function abrisFlag(Countries: Countries): angular.IDirective {
    return {
        template: `
            <span class="flag-icon flag-icon-{{ country.ISO2.toLowerCase() }}"></span>
        `,
        scope : {
            countryCode : '@countryCode',
            codeType: '@?'
        },
        link: function(scope: any, elm: Element, attrs: any) {

            scope.codeType = scope.codeType || 'ISO2';
            
            // attrs.$observe('flag', function(value) {
                //var code = scope.$eval(attrs.).toLowerCase();
                for (var i = 0; i < Countries.countries.length; i++) {
                    if (Countries.countries[i].code.toLowerCase() === scope.countryCode.toLowerCase()) {
                        scope.country = Countries.countries[i];
                        break;
                    }
                }
            // });

        }
    }
}
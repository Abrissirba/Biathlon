/** @ngInject */
export function abrisFocus($timeout: angular.ITimeoutService): angular.IDirective {

    return {
        restrict: 'A',
        link(scope: any, element: HTMLLIElement, attr: any) {
            var scopeProps = attr.abrisFocus.split('.');
            var prop = scopeProps.pop();
            
            var scopeProp = scope;
            
            scopeProps.forEach((_scopeProp) => {
                scopeProp = scope[_scopeProp];
            });
            
            scopeProp[prop] = function () {
                $timeout(function() {
                    element[0].focus();
                });
            };
        }
    }
}
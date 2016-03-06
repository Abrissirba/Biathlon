import { NavbarController } from './navbar';

/** @ngInject */
export class NavbarState {
    private _items;
    private _navbarItemCallbacks = [];
    private navbar: NavbarController;
    
    private previousState = {
        'app.schedule': 'app.home',
        'app.competitions': 'app.schedule',
        'app.results': 'app.competitions',
        'app.cups': 'app.home',
        'app.cupresults': 'app.cups',
        'app.athletes': 'app.home',
        'app.stats': 'app.home',
        'app.statisticDefault': 'app.stats'
    };
    
    constructor(
        $rootScope: angular.IRootScopeService,
        private $state: angular.ui.IStateService
    ){

    }
    
    get items() : Array<any> {
        return this._items;
    }
    
    set items(items: Array<any>) {
        this._items = items;
        this._navbarItemCallbacks.forEach((fn) => {
            fn(this.items);
        });
    }
    

    
    setNavbar(navbar: NavbarController) {
        this.navbar = navbar;
    }
    
    toggleNavbar() {
        this.navbar.toggleNavbar();
    }
    
    registerItemsUpdatedCallback(fn: any) {
        this._navbarItemCallbacks.push(fn);
        fn(this.items);
    }
    
    goToPreviousState() {
        var prevStateName = this.previousState[this.$state.current.name];
        this.$state.go(prevStateName, this.$state.params);
    }
    
    canGoBack() {
        return angular.isDefined(this.previousState[this.$state.current.name]);
    }
    
}

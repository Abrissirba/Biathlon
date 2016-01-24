import { NavbarController } from './navbar';

export class NavbarState {
    private navbar: NavbarController;
        
    setNavbar(navbar: NavbarController) {
        this.navbar = navbar;
    }
    
    toggleNavbar() {
        this.navbar.toggleNavbar();
    }
}

/// <reference path="../../.tmp/typings/tsd.d.ts" />

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { abrisApp } from './components/app'
import { abrisHome } from './components/home'
import { abrisNavbar } from './components/navbar/navbar'

import { NavbarState } from './components/navbar/navbarState'

import {Athletes, Competitions, Bios, FactCategories, StatCategoriesService} from './services/services'

declare var moment: moment.MomentStatic;

module biathlon {
  'use strict';

  angular.module('biathlon', [
      'ngAnimate', 
      'ngSanitize', 
      'ngMessages', 
      'ngAria', 
      'ui.router', 
      'ngMaterial', 
      'toastr',
      'restangular',
      'pascalprecht.translate'])
    .constant('moment', moment)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    
    .directive('abrisApp', abrisApp)
    .directive('abrisNavbar', abrisNavbar)
    .directive('abrisHome', abrisHome)
    
    .service('NavbarState', NavbarState)
    .service('Athletes', Athletes)
    .service('Competitions', Competitions)
    .service('Bios', Bios)
    .service('FactCategories', FactCategories)
    .service('StatCategoriesService', StatCategoriesService);
}
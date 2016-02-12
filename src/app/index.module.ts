/// <reference path="../../.tmp/typings/tsd.d.ts" />

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { abrisApp } from './components/app';
import { abrisHome } from './components/home';
import { abrisNavbar } from './components/navbar/navbar';
import { abrisTopbar } from './components/navbar/topbar';
import { abrisEvents } from './components/events';
import { abrisCompetitions } from './components/competitions';
import { abrisResults } from './components/results';
import { abrisAnalysis } from './components/analysis';
import { abrisShootingBoard } from './components/shootingBoard';
import { abrisFlag } from './components/flag';

import { NavbarState } from './components/navbar/navbarState';

import {
    Athletes, 
    Competitions, 
    Bios, 
    FactCategories, 
    StatCategoriesService,
    CupResults,
    Cups,
    Events,
    FactItems,
    Organizers,
    Results,
    Seasons,
    StatItems,
    Stats,
    TableHelperService, 
    Analysis,
    ImageService,
    Countries} from './services/services';

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
      'md.data.table',
      'pascalprecht.translate',
      'googlechart'])
    .constant('moment', moment)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    
    .directive('abrisApp', abrisApp)
    .directive('abrisNavbar', abrisNavbar)
    .directive('abrisTopbar', abrisTopbar)
    .directive('abrisHome', abrisHome)
    .directive('abrisEvents', abrisEvents)
    .directive('abrisCompetitions', abrisCompetitions)
    .directive('abrisResults', abrisResults)
    .directive('abrisAnalysis', abrisAnalysis)
    .directive('abrisShootingBoard', abrisShootingBoard)
    .directive('abrisFlag', abrisFlag)
    
    .service('NavbarState', NavbarState)
    
    .service('Analysis', Analysis)
    .service('Athletes', Athletes)
    .service('Competitions', Competitions)
    .service('CupResults', CupResults)
    .service('Bios', Bios)
    .service('Cups', Cups)
    .service('Events', Events)
    .service('FactItems', FactItems)
    .service('Organizers', Organizers)
    .service('Results', Results)
    .service('Seasons', Seasons)
    .service('StatItems', StatItems)
    .service('Stats', Stats)
    .service('FactCategories', FactCategories)
    .service('StatCategoriesService', StatCategoriesService)
    .service('TableHelperService', TableHelperService)
    .service('ImageService', ImageService)
    .service('Countries', Countries);
}
/// <reference path="../../.tmp/typings/tsd.d.ts" />

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { abrisApp } from './components/app';
import { abrisHome } from './components/home';
import { abrisNavbar } from './components/navbar/navbar';
import { abrisTopbar } from './components/navbar/topbar';
import { abrisNavbarToggle } from './components/navbar/navbarToggle';
import { abrisEvents } from './components/events';
import { abrisCompetitions } from './components/competitions';
import { abrisResults } from './components/results';
import { abrisAnalysis } from './components/analysis';
import { abrisAthletes } from './components/athletes';
import { abrisAthlete } from './components/athlete';
import { abrisShootingBoard } from './components/shootingBoard';
import { abrisAvatar } from './components/avatar';
import { abrisInputSearch } from './components/inputs/inputSearch';
import { abrisInputFilter } from './components/inputs/inputOrder';
import { abrisFlag } from './components/flag';
import { abrisLanguageSelector } from './components/languageSelector';
import { abrisCups } from './components/cups';
import { abrisStatistics } from './components/statistics';
import { abrisStatisticDefault } from './components/StatisticDefault';
import { abrisStatGraph } from './components/StatGraph';
import { abrisCupResults } from './components/cupresults';
import { abrisFocus } from './components/inputs/focus';
import { abrisEventRankingResults } from './components/EventRankingResults';
import { abrisInstagramItem } from './components/instagramItem';
import { abrisAbout } from './components/about';

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
    Menus,
    Countries,
    Rankings} from './services/services';

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
      'googlechart',
      'abrissirba.mdComponentDialog',
      'matchMedia',
      'anim-in-out'])
    .constant('moment', moment)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    
    .directive('abrisApp', abrisApp)
    .directive('abrisNavbar', abrisNavbar)
    .directive('abrisTopbar', abrisTopbar)
    .directive('abrisNavbarToggle', abrisNavbarToggle)
    .directive('abrisHome', abrisHome)
    .directive('abrisEvents', abrisEvents)
    .directive('abrisCompetitions', abrisCompetitions)
    .directive('abrisResults', abrisResults)
    .directive('abrisAnalysis', abrisAnalysis)
    .directive('abrisShootingBoard', abrisShootingBoard)
    .directive('abrisAvatar', abrisAvatar)
    .directive('abrisInputSearch', abrisInputSearch)
    .directive('abrisInputFilter', abrisInputFilter)
    .directive('abrisFlag', abrisFlag)
    .directive('abrisFocus', abrisFocus)
    .directive('abrisLanguageSelector', abrisLanguageSelector)
    .directive('abrisCups', abrisCups)
    .directive('abrisCupResults', abrisCupResults)
    .directive('abrisStatistics', abrisStatistics)
    .directive('abrisStatisticDefault', abrisStatisticDefault)
    .directive('abrisStatGraph', abrisStatGraph)
    .directive('abrisAthletes', abrisAthletes)
    .directive('abrisAthlete', abrisAthlete)
    .directive('abrisEventRankingResults', abrisEventRankingResults)
    .directive('abrisInstagramItem', abrisInstagramItem)
    .directive('abrisAbout', abrisAbout)
    
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
    .service('Menus', Menus)
    .service('Countries', Countries)
    .service('Rankings', Rankings);
}
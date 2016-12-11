import { Results, ImageService, TableHelperService, Competitions } from '../services/services';
import { IResult, IRelayResult, ICompetition } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisResults(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        seasonId: '=?',
        eventId: '=?',
        raceId: '=?',
        searchText: '=?',
        staticSize: '=?'
    },
    templateUrl: 'app/components/results.html',
    controller: ResultsController,
    controllerAs: 'resultsVm',
    bindToController: true
  };

}

/** @ngInject */
export class ResultsController extends TableBaseController<IResult> {
    
    results: Array<IResult>;
    _results: Array<IResult>;
    relayResults: Array<IRelayResult>;
    _relayResults: Array<IRelayResult>;
    smallDevice: boolean;
    seasonId: string;
    eventId: string;
    race: ICompetition;
    raceId: string;
    staticSize: string;
    searchText: string = '';
    searchMode: boolean = false;
    orderProps = [{
        title: 'RANK',
        key: 'Rank'
    }, {
        title: 'NAME',
        key: 'Name'
    }, {
        title: 'NATIONALITY',
        key: 'Nat'
    }, {
        title: 'SHOOTINGS',
        key: 'Shootings'
    }];
    
    constructor(
        TableHelperService: TableHelperService,
        private Results: Results,
        private Competitions: Competitions,
        private $state: angular.ui.IStateService,
        private NavbarState: NavbarState,
        private ImageService: ImageService,
        private $scope: angular.IScope,
        private $mdDialog: any,
        private $element: any,
        private screenSize: any,
        private $timeout: angular.ITimeoutService) {
        
        super(TableHelperService, 'results', {order: 'Rank'});
        
        $scope.$watch('resultsVm.searchText', (val: string) => this.filter(val));
        
        this.seasonId = this.seasonId || this.$state.params['seasonId'];
        this.eventId = this.eventId || this.$state.params['eventId'];
        this.raceId = this.raceId || this.$state.params['raceId'];
        

        
        this.promise = this.Competitions.get(this.eventId, this.raceId).then((race: ICompetition) => {
            this.race = race;
            
            this.promise = Results.getList(this.raceId).then((data) => {
                if (angular.isDefined(data[0].Leg) && data[0].Leg !== null) {
                    this._relayResults = Results.parseRelayData(data);
                    this.relayResults = this._relayResults;
                }
                else {
                    this._results = data;
                    this.results = data;
                }
                var defaultSortOrder = this.race.StatusId === 3 ? "StartOrder" : 'Rank';
                this.onReorder(defaultSortOrder);
                this.setVerticalContainerHeight(this.$timeout, this.$element, this.$scope);
            });
        });
                
        this.Competitions.getList(this.eventId).then((competitions: Array<ICompetition>) => {
            competitions.forEach((race: ICompetition) => {
                if (race.RaceId === this.raceId) {
                    this.race = race; 
                }
            });
        });
        
        this.Competitions.getList(this.eventId).then((competitions: Array<ICompetition>) => {
            var items = [];
            competitions.forEach((competition: ICompetition) => {
                items.push({
                   title: competition.ShortDescription,
                   active: competition.RaceId === this.raceId,
                   state: 'app.results({seasonId: "' + this.seasonId + '", eventId: "' + this.eventId + '", raceId: "' + competition.RaceId + '"})'
                });
            });
            this.NavbarState.items = items;
        });
        
        this.setSizeListeners();
        
    }
    
    setSizeListeners() {
        if(angular.isDefined(this.staticSize)) {
            this.smallDevice = this.staticSize === 'lg' ? false : true;
        }
        else {
            this.smallDevice = this.screenSize.is('xs, sm');
            this.screenSize.on('xs, sm', (match) =>{
                this.smallDevice = match;
            });
        }
    }
    

    
    filter(val: string){
        if(angular.isDefined(val)){
            val = val.toLowerCase();
            
            if (this._results) {
                this.results = this._results.filter((result: IResult) => {
                    return result.Nat.toLowerCase().indexOf(val) > -1 || result.Name.toLowerCase().indexOf(val) > -1;
                }); 
            }
            else if(this._relayResults) {
                this.relayResults = this._relayResults.filter((result: IRelayResult) => {
                    for (var i = 0; i < result.individualResults.length; i++) {
                        if (result.individualResults[i].Name.toLowerCase().indexOf(val) > -1) {
                           return true; 
                        }
                    }
                    return result.teamResult.Nat.toLowerCase().indexOf(val) > -1 || result.teamResult.Name.toLowerCase().indexOf(val) > -1;
                });
            }
            
        }
    }
    
    getAvatarUrl(result: IResult){
        if(result.Leg !== 0){
            return this.ImageService.getImageUrl(result.IBUId);
        }
    }
    
    getRank(result: IResult){
        if(<any>result.Rank < 990){
            return result.Rank.toString();
        }
        else if(result.IRM){
            return result.IRM;
        }
        return '';
    }
    
    onReorder = (order: string) => {
        this.query = angular.extend({}, this.query, {order: order});
        if(this._results){      
            super.order(this.results);
        }
        else {
            this.query.order = 'teamResult.' + order;
            this.relayResults = this.TableHelperService.order(this._relayResults, this.query);
            this.results = this.Results.getFlatRelayResult(this.relayResults);
        }
    };
    
    openAnalysis(result: IResult) {
        this.$mdDialog.showAbrisComponentDialog({
            componentName: 'abrisAnalysis',
            title: result.Name,
            params: {
                raceId: this.raceId,
                ibuId: result.IBUId
            },
            fullscreen: true
        });
    }
}
import { Results, ImageService, TableHelperService, Competitions } from '../services/services';
import { IResult, IRelayResult, ICompetition } from '../models/models';
import { TableBaseController } from './TableBaseComponent';
import { NavbarState } from './navbar/navbarState';

/** @ngInject */
export function abrisResults(): angular.IDirective {

  return {
    restrict: 'E',
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
    searchString: string;
    mobile: string;
    desktop: string;
    seasonId: string;
    eventId: string;
    raceId: string;
    competition: ICompetition;
    
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
        private $state: angular.ui.IStateService,
        private ImageService: ImageService,
        private $scope: angular.IScope,
        private $mdDialog: any,
        private $element: any,
        private screenSize: any,
        private $timeout: angular.ITimeoutService,
        private NavbarState: NavbarState,
        private Competitions: Competitions) {
        
        super(TableHelperService, 'results', {order: 'Rank'});
        
        $scope.$watch('resultsVm.searchString', (val: string) => this.filter(val))
        
        this.seasonId = this.$state.params['seasonId'];
        this.eventId = this.$state.params['eventId'];
        this.raceId = this.$state.params['raceId'];
        
        this.Competitions.getList(this.eventId).then((competitions: Array<ICompetition>) => {
            competitions.forEach((competition: ICompetition) => {
                if (competition.RaceId === this.raceId) {
                    this.competition = competition; 
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
        
        
        this.promise = Results.getList(this.raceId).then((data) => {
            if (angular.isDefined(data[0].Leg) && data[0].Leg !== null) {
                this._relayResults = Results.parseRelayData(data);
                this.relayResults = this._relayResults;
            }
            else {
                this._results = data;
                this.results = data;
            }
            this.onReorder('Rank');
            this.setVerticalContainerHeight();
        });
        
        this.setSizeListeners();
        
    }
    
    setSizeListeners() {
        this.mobile = this.screenSize.on('xs, sm', (match) =>{
            this.mobile = match;
        });
        this.desktop = this.screenSize.on('md, lg', (match) => {
            this.desktop = match;
        });
    }
    
    setVerticalContainerHeight() {
        this.$timeout(() => {
            var elements = this.$element.find('md-virtual-repeat-container');
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var height = window.innerHeight - element.offsetTop;

                element.style.height = height + 'px';
                console.log(element);
            }
            this.$scope.$broadcast('$md-resize');
        });
    }
    
    filter(val: string){
        if(angular.isDefined(val)){
            val = val.toLowerCase();
            
            if (this.results) {
                this.results = this._results.filter((result: IResult) => {
                    return result.Nat.toLowerCase().indexOf(val) > -1 || result.Name.toLowerCase().indexOf(val) > -1;
                }); 
            }
            else {
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
        if(result.Rank < 990){
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
import { Analysis } from '../services/services';
import { IAnalyzeField } from '../models/models';

/** @ngInject */
export function abrisAnalysis(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        raceId: '=',
        ibuId: '='
    },
    template: `
        <md-card class="diagram">
            <md-radio-group class="options" ng-model="analysisVm.selectedDiagram" layout="row" layout-align="end center">
                <md-radio-button value="rank" ><span translate> RANK </span></md-radio-button>
                <md-radio-button value="behind"><span translate> BEHIND </span></md-radio-button>
            </md-radio-group>
            <div class="chart" google-chart chart='analysisVm.progressionChart'></div>
        </md-card>
        
        <md-card>
            <div class="lap-analysis-container" layout="row" layout-xs="column" layout-sm="column">
   
                <div layout="column" layout-align="center center" class="column row-descriptions" hide-xs hide-sm>
                    <div class="md-caption" translate>CUMULATIVE</div>
                    <div class="md-caption" translate>LAP</div>
                    <div class="md-caption" translate>RANGE</div> 
                    <div class="md-caption" translate>COURSE</div>
                    <div class="md-caption" translate>SHOOTING_TIME</div>
                    <div class="md-caption shooting" translate>SHOOTING</div>
                </div>

    
                <div layout="column" ng-repeat="lap in analysisVm.lapAnalyze" layout-align="start center">
                    <div class="md-subhead">{{::analysisVm.getLapTitle($index + 1)}}</div>
                    <md-card>
                        <div layout="row">
                            <div layout="column" class="column"  layout-align="end end" hide-gt-sm>
                                <div class="md-caption"><span translate>CUMULATIVE</span>:</div>
                                <div class="md-caption" ><span translate>LAP</span>:</div>
                                <div class="md-caption" ><span translate>RANGE</span>:</div> 
                                <div class="md-caption" ><span translate>COURSE</span>:</div>
                                <div class="md-caption" ><span translate>SHOOTING</span>:</div>  
                            </div>
                            <div layout="column" class="column"  layout-align="end end">
                                <div class="column-title" translate>TIME</div>
                                <div>{{::lap.Cummulative.Value || '&nbsp;'}}</div>
                                <div>{{::lap.Lap.Value || '&nbsp;'}}</div>
                                <div>{{::lap.Range.Value|| '&nbsp;'}}</div> 
                                <div>{{::lap.Course.Value|| '&nbsp;'}}</div>
                                <div>{{::lap.ShootingTime.Value|| '&nbsp;'}}</div> 
                            </div>
                            <div layout="column" class="column" layout-align="end end">
                                <div class="column-title" translate>BEHIND</div>
                                <div>{{::lap.Cummulative.Behind|| '&nbsp;'}}</div>
                                <div>{{::lap.Lap.Behind || '&nbsp;'}}</div>
                                <div>{{::lap.Range.Behind|| '&nbsp;'}}</div> 
                                <div>{{::lap.Course.Behind|| '&nbsp;'}}</div>
                                <div>{{::lap.ShootingTime.Behind|| '&nbsp;'}}</div>  
                            </div>
                            <div layout="column" class="column" layout-align="end end">
                                <div class="column-title" translate>RANK</div>
                                <div>{{::lap.Cummulative.Rank|| '&nbsp;'}}</div>
                                <div>{{::lap.Lap.Rank || '&nbsp;'}}</div>
                                <div>{{::lap.Range.Rank|| '&nbsp;'}}</div> 
                                <div>{{::lap.Course.Rank|| '&nbsp;'}}</div>
                                <div>{{::lap.ShootingTime.Rank|| '&nbsp;'}}</div>  
                            </div>
                        </div>
                        <div layout="row" layout-align="center center" ng-if="lap.Shooting && $index !== analysisVm.lapAnalyze.length - 1">
                            <abris-shooting-board value="lap.Shooting.Value"></abris-shooting-board>
                        </div>
                        
                    </md-card>
                </div>
            </div>
        </md-card>
    `,
    controller: AnalysisController,
    controllerAs: 'analysisVm',
    bindToController: true
  };

}

/** @ngInject */
export class AnalysisController {
    ibuId: string;
    raceId: string;
    selectedDiagram: string;
  
    nrOfLaps: number;
    lapAnalyze: Array<any>;
    progressionAnalyze: Array<IAnalyzeField>;
  
    progressionChart: angular.googleChart.IChart<google.visualization.LineChartOptions>;
    
    constructor(
        private Analysis: Analysis,
        private $scope: angular.IScope) {

        Analysis.getList(this.raceId, this.ibuId).then((data) => {
            this.nrOfLaps = Analysis.getNrOfLaps(data);
            this.lapAnalyze = Analysis.getLapAnalyzation(data, this.nrOfLaps);
            this.progressionAnalyze = Analysis.getProgressionAnalyzation(data, this.nrOfLaps);
                        
            this.initProgressionsDiagram(this.progressionAnalyze, 'rank');
        });
        
        $scope.$watch('analysisVm.selectedDiagram', (newVal: string, oldVal: string) => {
           if (newVal !== oldVal) {
               this.selectDiagram(newVal);
           } 
        });
        
        this.selectedDiagram = 'rank';
    }
    
    parseDate(behind: string) : Date {
        var minutes = 0, seconds = 0, ms = 0;
        var splits = behind.split(':');        
        if(splits.length === 2){
            minutes = parseInt(splits[0].substr(1));
            seconds = parseInt(splits[1].split('.')[0]);
            ms = parseInt(splits[1].split('.')[1]) * 100;
        }
        else if(splits.length === 1){
            var sec = splits[0].split('.')[0];
            if(sec.indexOf('+') > -1){
                sec = sec.substr(1);
            }
            seconds = parseInt(sec);
            ms = parseInt(splits[0].split('.')[1]) * 100;
        }
        
        
        return new Date(0,0,0,0,minutes, seconds, ms);
    }
    
    parseRank(rank: string) : number {
        return parseInt(rank.match(/\d+/)[0]);
    }
    
    selectDiagram(diagramType: string) {
        this.initProgressionsDiagram(this.progressionAnalyze, diagramType);
    }
    
    getLapTitle(index: number) {
        if(index < this.lapAnalyze.length) {
            return 'LAP ' + index;
        }
        if(index <= this.lapAnalyze.length) {
            return 'TOTAL';
        }
    }
    
    initProgressionsDiagram(fields: Array<IAnalyzeField>, type: string){
        
        var rows = [];
        var highestRank = 1;
        fields.forEach((field) => {
            if (type === 'rank' && this.parseRank(field.Rank) > highestRank) {
                highestRank = this.parseRank(field.Rank);
            }
            
            rows.push({
               c: [{
                   v: field.FieldId
               },{
                   v: type === 'rank' ? this.parseRank(field.Rank) : this.parseDate(field.Behind),
                   f: type === 'rank' ? this.parseRank(field.Rank).toString() : field.Behind
               }] 
            });
        });
        
        var ticks = [1];
        var length = highestRank / 5 + 1;
        for (var i = 1; i < length; i++) {
            ticks.push(i*5);
        }

        this.progressionChart = {
            type: 'LineChart',
            data: {
                cols: [{
                    id: 'control',
                    label: 'Control',
                    type: 'string'
                }, {
                    id: 'one',
                    label: type === 'rank' ? 'Rank' : 'Behind',
                    type: type === 'rank' ? 'number' : 'datetime'
                }],
                rows: rows
            },
            options: {
                title: 'Progression',
                colors: ['#0000FF', '#009900', '#CC0000', '#DD9900'],
                vAxis: {
                    title: type === 'rank' ? 'Rank' : 'Time behind',
                    direction: -1,
                    format: type === 'rank' ? '' : 'mm:ss',
                    minValue: type === 'rank' ? 1 : <any>new Date(0,0,0,0,0,0,0),
                    ticks: type === 'rank' ? ticks : null
                },
                hAxis: {
                    title: 'Control'
                },
                height: 250,
                animation: {
                    startup: false,
                    duration: 300,
                    easing: 'inAndOut'
                }
            },

            view: {
                columns: [0, 1]
            }
        }
    }
}

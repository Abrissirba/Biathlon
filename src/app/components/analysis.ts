import { Analysis } from '../services/services';
import { IAnalyzeField } from '../models/models';

/** @ngInject */
export function abrisAnalysis(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <div google-chart chart='analysisVm.progressionChart' style='border:1px inset black;padding:0;width:1000px'></div>
        
        <md-card>
            <div layout="row" layout-xs="column">
   
                <div layout="column" layout-align="center center" class="column row-descriptions" show-gt-sm>
                    <div class="md-caption" translate>CUMULATIVE</div>
                    <div class="md-caption" translate>LAP</div>
                    <div class="md-caption" translate>RANGE</div> 
                    <div class="md-caption" translate>COURSE</div>
                    <div class="md-caption" translate>SHOOTING_TIME</div>
                    <div class="md-caption shooting" translate>SHOOTING</div>
                </div>

    
                <div layout="column" ng-repeat="lap in analysisVm.lapAnalyze" layout-align="center center">
                    <div class="md-subhead">Lap {{$index + 1}}</div>
                    <md-card flex>
                        <div layout="row">
                            <!-- <div layout="column" class="column">
                                <div></div><div></div><div></div><div></div>
                                <div>{{lap.Shooting.Value}}</div>
                            </div> -->
                            <div layout="column" class="column"  layout-align="end end" hide-gt-sm>
                                <div class="md-caption"><span translate>CUMULATIVE</span>:</div>
                                <div class="md-caption" ><span translate>LAP</span>:</div>
                                <div class="md-caption" ><span translate>RANGE</span>:</div> 
                                <div class="md-caption" ><span translate>COURSE</span>:</div>
                                <div class="md-caption" ><span translate>SHOOTING</span>:</div>  
                            </div>
                            <div layout="column" class="column"  layout-align="end end">
                                <div class="md-body-2" translate>TIME</div>
                                <div>{{lap.Cummulative.Value || '&nbsp;'}}</div>
                                <div>{{lap.Lap.Value || '&nbsp;'}}</div>
                                <div>{{lap.Range.Value|| '&nbsp;'}}</div> 
                                <div>{{lap.Course.Value|| '&nbsp;'}}</div>
                                <div>{{lap.ShootingTime.Value|| '&nbsp;'}}</div> 
                            </div>
                            <div layout="column" class="column" layout-align="end end">
                                <div class="md-body-2" translate>BEHIND</div>
                                <div>{{lap.Cummulative.Behind|| '&nbsp;'}}</div>
                                <div>{{lap.Lap.Behind || '&nbsp;'}}</div>
                                <div>{{lap.Range.Behind|| '&nbsp;'}}</div> 
                                <div>{{lap.Course.Behind|| '&nbsp;'}}</div>
                                <div>{{lap.ShootingTime.Behind|| '&nbsp;'}}</div>  
                            </div>
                            <div layout="column" class="column" layout-align="end end">
                                <div class="md-body-2" translate>RANK</div>
                                <div>{{lap.Cummulative.Rank|| '&nbsp;'}}</div>
                                <div>{{lap.Lap.Rank || '&nbsp;'}}</div>
                                <div>{{lap.Range.Rank|| '&nbsp;'}}</div> 
                                <div>{{lap.Course.Rank|| '&nbsp;'}}</div>
                                <div>{{lap.ShootingTime.Rank|| '&nbsp;'}}</div>  
                            </div>
                        </div>
                        <div layout="row" layout-align="center center">
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
  
    nrOfLaps: number;
    lapAnalyze: Array<any>;
    progressionAnalyze: Array<IAnalyzeField>;
  
    progressionChart: angular.googleChart.IChart<google.visualization.LineChartOptions>;
    
    constructor(
        private Analysis: Analysis) {
        
        Analysis.getList('BT1516SWRLCP05SWIN', 'BTSWE21607199101').then((data) => {
            this.nrOfLaps = Analysis.getNrOfLaps(data);
            this.lapAnalyze = Analysis.getLapAnalyzation(data, this.nrOfLaps);
            this.progressionAnalyze = Analysis.getProgressionAnalyzation(data, this.nrOfLaps);
            
            console.log(this.lapAnalyze);
            console.log(this.progressionAnalyze);
            
            this.initProgressionsDiagram(this.progressionAnalyze, 'rank');
        });
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
            seconds = parseInt(splits[0].split('.')[0].substr(1));
            ms = parseInt(splits[0].split('.')[1]) * 100;
        }
        
        
        return new Date(0,0,0,0,minutes, seconds, ms);
    }
    
    parseRank(rank: string) : number {
        return parseInt(rank.match(/\d+/)[0]);
    }
    
    initProgressionsDiagram(fields: Array<IAnalyzeField>, type: string){
        
        var rows = [];
        fields.forEach((field) => {
            rows.push({
               c: [{
                   v: field.FieldId
               },{
                   v: type === 'rank' ? this.parseRank(field.Rank) : this.parseDate(field.Behind),
                   f: type === 'rank' ? this.parseRank(field.Rank).toString() : field.Behind
               }] 
            });
        });

        this.progressionChart =  {
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
                    gridlines: {
                        count: 10
                    }
                },
                hAxis: {
                    title: 'Control'
                }
            },

            view: {
                columns: [0, 1]
            }
        }
    }
}

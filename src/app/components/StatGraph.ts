import { Stats, StatItems } from '../services/services';
import { IStatItem, IStat } from '../models/models';

/** @ngInject */
export function abrisStatGraph(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        ibuid: '=',
        statisticId: '='
    },
    template: `
        <md-card class="diagram">
            <div class="chart" google-chart chart='statGraphVm.chart'></div>
        </md-card>
        
    `,
    controller: StatGraphController,
    controllerAs: 'statGraphVm',
    bindToController: true
  };

}

/** @ngInject */
export class StatGraphController {
    ibuid: string;
    statisticId: string;
    statItem: IStatItem;
    stats: Array<IStat>;
      
    chart: angular.googleChart.IChart<google.visualization.LineChartOptions>;
    
    constructor(
        private Stats: Stats,
        private StatItems: StatItems) {

            this.StatItems.get(this.statisticId).then((statItem: IStatItem) => {
                this.statItem = statItem;
                
                this.Stats.getList({
                    statId: this.statItem.StatId,
                    statisticId: this.statItem.StatisticId,
                    ibuId: this.ibuid
                }).then((stats: Array<IStat>) => {                        
                    this.initDiagram(stats);
                });
            });
    }
    
    
    
    initDiagram(stats: Array<IStat>){
        
        var rows = [];
        var highestRank = 1;
        stats.forEach((stat) => {           
            rows.push({
               c: [{
                   v: stat.Season
               },{
                   v: stat.Value,
                   f: stat.Value
               }] 
            });
        });
        
        this.chart = {
            type: 'LineChart',
            data: {
                cols: [{
                    id: 'season',
                    label: 'Control',
                    type: 'string'
                }, {
                    id: 'value',
                    label: 'VALUE',
                    type: 'number'
                }],
                rows: rows
            },
            options: {
                title: 'Progression',
                colors: ['#0000FF', '#009900', '#CC0000', '#DD9900'],
                vAxis: {
                    title: 'VALUE'
                },
                hAxis: {
                    title: 'SEASON'
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

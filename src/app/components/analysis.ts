import { Analysis } from '../services/services'

/** @ngInject */
export function abrisAnalysis(): angular.IDirective {

  return {
    restrict: 'E',
    template: `
        <div google-chart chart="analysisVm.progressionChart" style="border:1px inset black;padding:0;width:400px">
        </div>
    `,
    controller: AnalysisController,
    controllerAs: 'analysisVm',
    bindToController: true
  };

}

/** @ngInject */
export class AnalysisController {
  
    nrOfLaps: number;
    lapAnalyze;
    progressionAnalyze;
  
    progressionChart = {
        type: "LineChart",
        data: {
                "cols": [{
                    id: "month",
                    label: "Month",
                    type: "string"
                }, {
                    id: "laptop-id",
                    label: "Laptop",
                    type: "number"
                }, {
                    id: "desktop-id",
                    label: "Desktop",
                    type: "number"
                }, {
                    id: "server-id",
                    label: "Server",
                    type: "number"
                }, {
                    id: "cost-id",
                    label: "Shipping",
                    type: "number"
                }],
                "rows": [{
                    c: [{
                        v: "January"
                    }, {
                        v: 19,
                        f: "42 items"
                    }, {
                        v: 12,
                        f: "Ony 12 items"
                    }, {
                        v: 7,
                        f: "7 servers"
                    }, {
                        v: 4
                    }]
                }, {
                    c: [{
                        v: "February"
                    }, {
                        v: 13
                    }, {
                        v: 1,
                        f: "1 unit (Out of stock this month)"
                    }, {
                        v: 12
                    }, {
                        v: 2
                    }]

                }, {
                    c: [{
                        v: "March"
                    }, {
                        v: 24
                    }, {
                        v: 5
                    }, {
                        v: 11
                    }, {
                        v: 6
                    }]
                }]
            },
            options: {
                "title": "Sales per month",
                "colors": ['#0000FF', '#009900', '#CC0000', '#DD9900'],
                "defaultColors": ['#0000FF', '#009900', '#CC0000', '#DD9900'],
                "isStacked": "true",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Sales unit",
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Date"
                }
            },

            view: {
                columns: [0, 1, 2, 3, 4]
            }
    };
    constructor(
        private Analysis: Analysis) {
        
        Analysis.getList("BT1516SWRLCP05SWIN", "BTSWE21607199101").then((data) => {
            this.nrOfLaps = Analysis.getNrOfLaps(data);
            this.lapAnalyze = Analysis.getLapAnalyzation(data, this.nrOfLaps);
            this.progressionAnalyze = Analysis.getProgressionAnalyzation(data, this.nrOfLaps);
            
            console.log(this.lapAnalyze);
            console.log(this.progressionAnalyze);
        });
    }
}

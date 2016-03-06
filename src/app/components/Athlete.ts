import { Athletes, Bios, ImageService } from '../services/services';
import { IAthlete, IBio } from '../models/models';

/** @ngInject */
export function abrisAthlete(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        athlete: '='
    },
    template: `
    <md-content>
        <md-card>
        
            <md-card-title>
                <md-card-title-text>
                    <span class="md-headline">{{::athleteVm.athlete.GivenName}} {{::athleteVm.athlete.FamilyName}} </span>
                    <span layout="row" layout-align="start center">
                        <span class="md-subhead">{{::athleteVm.athlete.Age}} {{'YEARS' | translate}}</span>
                        <abris-flag country-code="{{::athleteVm.athlete.NAT}}"></abris-flag>
                    </span>
                    <div class="athlete-data-container">
                        <div ng-if="athleteVm.athleteData['Fabebook'].Value.length > 0">
                            <div class="md-caption">Facebook</div>
                            <div class="md-body-2">{{athleteVm.athleteData["Fabebook"].Value}}</div>
                        </div>
                        <div ng-if="athleteVm.athleteData['Twitter'].Value.length > 0">
                            <div class="md-caption">Twitter</div>
                            <div class="md-body-2"><a ng-href="https://www.twitter.com/{{athleteVm.athleteData['Twitter'].Value}}">{{athleteVm.athleteData["Twitter"].Value}}</a></div>
                        </div>
                        <div ng-if="athleteVm.athleteData['Instagram'].Value.length > 0">
                            <div class="md-caption">Instagram</div>
                            <div class="md-body-2"><a ng-href="{{athleteVm.getInstagramUrl()}}">{{athleteVm.athleteData["Instagram"].Value}}</a></div>
                        </div>
                        <div ng-if="athleteVm.athleteData['Website'].Value.length > 0">
                            <div class="md-caption" translate>WEBSITE</div>
                            <div class="md-body-2"><a ng-href="http://{{athleteVm.athleteData['Website'].Value}}">{{athleteVm.athleteData["Website"].Value}}</a></div>
                        </div>
                        <div ng-if="athleteVm.athleteData['Height'].Value.length > 0">
                            <div class="md-caption" translate>HEIGHT</div>
                            <div class="md-body-2">{{athleteVm.athleteData["Height"].Value}}</div>
                        </div>
                        <div ng-if="athleteVm.athleteData['Weight'].Value.length > 0">
                            <div class="md-caption" translate>WEIGHT</div>
                            <div class="md-body-2">{{athleteVm.athleteData["Weight"].Value}}</div>
                        </div>
                        <div ng-if="athleteVm.athleteData['Birth Place'].Value.length > 0">
                            <div class="md-caption" translate>BIRTH_PLACE</div>
                            <div class="md-body-2">{{athleteVm.athleteData["Birth Place"].Value}}</div>
                        </div>
                        <div ng-if="athleteVm.athleteData['Education (High School, University)'].Value.length > 0">
                            <div class="md-caption" translate>EDUCATION</div>
                            <div class="md-body-2">{{athleteVm.athleteData["Education (High School, University)"].Value}}</div>
                        </div>
                    </div>
                </md-card-title-text>
                <md-card-title-media>
                    <div class="card-media">
                        <img ng-src="{{::athleteVm.getImageUrl()}}" />
                    </div>
                </md-card-title-media>
            </md-card-title>
            
            
        </md-card>
    </md-content>
    `,
    controller: AthleteController,
    controllerAs: 'athleteVm',
    bindToController: true
  };

}

/** @ngInject */
export class AthleteController {
    promise: angular.IPromise<any>;
    athleteData: any = {};
    mobile: string;
    desktop: string;
    searchMode: boolean = false;
    athlete: IAthlete;
    
    constructor(
        private Athletes: Athletes,
        private ImageService: ImageService,
        private Bios: Bios,
        private $state: angular.ui.IStateService,
        private screenSize: any,
        private $scope: any) {
                
        this.promise = this.Bios.getList(this.athlete.IBUId).then((data) => {
            data.forEach((bioData: IBio) => {
                this.athleteData[bioData.Description] = bioData;
            });
        });
        
        this.setSizeListeners();
    }

    
    setSizeListeners() {
        this.mobile = this.screenSize.on('xs', (match) =>{
            this.mobile = match;
        });
        this.desktop = this.screenSize.on('sm, md, lg', (match) => {
            this.desktop = match;
        });
    }
    
    getImageUrl() {
        return this.ImageService.getImageUrl(this.athlete.IBUId);
    }
    
    getInstagramUrl() {
        if(this.athleteData['Instagram']){
            var name = this.athleteData['Instagram'].Value;
            if(name.indexOf('@') === 0) {
                name = name.substr(1);
            }
            return 'https://www.instagram.com/' + name;
        }
        
    }
}
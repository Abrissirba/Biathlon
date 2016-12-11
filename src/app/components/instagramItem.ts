import { ImageService } from '../services/services';

/** @ngInject */
export function abrisInstagramItem(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        itemId: '='
    },
    template: `
        <blockquote class="instagram-media" data-instgrm-version="7">
            <a ng-href="{{instagramItemVm.getUrl()}}" target="_blank" ></a>
        </blockquote>
    `,
    controller: InstagramItemController,
    controllerAs: 'instagramItemVm',
    bindToController: true
  };

}

/** @ngInject */
export class InstagramItemController {
    
    itemId: string;
    baseUrl = "https://www.instagram.com/p/";
    constructor(
        private ImageService: ImageService,
        private $scope: any) {
        
        this.$scope.$watch('instagramItemVm.itemId', () => {
            if(this.itemId && window.instgrm) {
                instgrm.Embeds.process();
            }
        });
    }
    
    getUrl(){
        if(this.itemId){
            return this.baseUrl + this.itemId;
        }
    }
}

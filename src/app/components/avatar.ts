import { ImageService } from '../services/services';

/** @ngInject */
export function abrisAvatar(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
        ibuid: '='
    },
    replace: true,
    template: `
        <img class="md-avatar" ng-src="{{avatarVm.getAvatarUrl(result)}}"></img>
    `,
    controller: AvatarController,
    controllerAs: 'avatarVm',
    bindToController: true
  };

}

/** @ngInject */
export class AvatarController {
    
    ibuid: string;
    
    constructor(private ImageService: ImageService) {
        
    }
    
    getAvatarUrl(){
        if(this.ibuid){
            return this.ImageService.getImageUrl(this.ibuid);
        }
    }
}

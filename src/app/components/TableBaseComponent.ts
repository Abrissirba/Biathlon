import { ITableQuery } from '../models/models';
import { TableHelperService } from '../services/services'

export class TableBaseController <TEntity> {

    promise: angular.IPromise<void>;
    loadedOnce: boolean = false;
    
    query: ITableQuery = {
        order: 'id',
        filter: ''
    };
    
    constructor(
        protected TableHelperService: TableHelperService,
        protected entity: string, 
        query?: ITableQuery ) {
        
        this.query = query || this.query;
        
    }

    onReorder = (order: string) => {
        this.query = angular.extend({}, this.query, {order: order});
        this.order(this[this.entity]);
    };
    
    onPaginate = (page: number, limit: number) => {
        this.query = angular.extend({}, this.query, {page: page, limit: limit});
    };
    
    order (items: Array<any>) {
        this[this.entity] = this.TableHelperService.order(items, this.query);
    }
    
    setVerticalContainerHeight($timeout: angular.ITimeoutService, $element: any, $scope: angular.IScope) {
        $timeout(() => {
            var elements = $element.find('md-virtual-repeat-container');
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var viewportOffset = elements[i].getBoundingClientRect();
                var height = window.innerHeight - viewportOffset.top;
                var padding = 16;
                
                element.style.height = height - padding + 'px';
                console.log(element);
            }
            $scope.$broadcast('$md-resize');
        });
    }
}
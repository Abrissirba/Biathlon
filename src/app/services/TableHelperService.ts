import { ITableQuery } from '../models/models';

export class TableHelperService {

    order (items: Array<any>, query: ITableQuery) : Array<any> {
        var order = query.order[0] === '-' ? query.order.substring(1) : query.order;
        var dir = query.order[0] === '-' ? -1 : 1;
        
        return items.sort((a: any, b: any) => {
            if (a[order] > b[order]) {
                return 1 * dir;
            }
            else if (a[order] < b[order]) {
                return -1 * dir;
            }
            return 0;
        });
    }

}
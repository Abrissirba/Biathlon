import { ITableQuery } from '../models/models';

export class TableHelperService {

    order (items: Array<any>, query: ITableQuery) : Array<any> {
        var orderBy = query.order[0] === '-' ? query.order.substring(1) : query.order;
        var dir = query.order[0] === '-' ? -1 : 1;
        
        var properties = orderBy.split('.');
        
        return items.sort((a: any, b: any) => {
            var aVal = a, bVal = b;
            properties.forEach((property) => {
                aVal = aVal[property];
                bVal = bVal[property];
            });
            
            if (aVal > bVal) {
                return 1 * dir;
            }
            else if (aVal < bVal) {
                return -1 * dir;
            }
            return 0;
        });
    }

}
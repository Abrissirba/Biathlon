import { IStatCategory } from '../models/models'

/** @ngInject */
export class StatCategoriesService {
    categories: Array<IStatCategory> =  [{
        key: 'WC',
        title: 'World Cup Statistics'
    },{
        key: 'WCH',
        title: 'WCH/Medal Statistics'
    }];
};
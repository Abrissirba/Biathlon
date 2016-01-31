import { IStatCategory } from '../models/models'

export class StatCategoriesService {
    categories: Array<IStatCategory> =  [{
        key: 'WC',
        title: 'World Cup Statistics'
    },{
        key: 'WCH',
        title: 'WCH/Medal Statistics'
    }];
};
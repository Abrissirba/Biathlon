import {IFactCategory} from '../models/models'

export class FactCategories {
    categories: Array<IFactCategory> =  [{
        key: 'RANKS',
        title: 'Ranking Statistics'
    },{
        key: 'ANAG',
        title: 'Anagraphy'
    },{
        key: 'COMP',
        title: 'Participation'
    },{
        key: 'SHOOT',
        title: 'Course/Competiton'
    },{
        key: 'GPERF',
        title: 'Shooting'
    },{
        key: 'RANKS',
        title: 'General Performance'
    },{
        key: 'GPERF',
        title: 'Individual Performance'
    }];
};


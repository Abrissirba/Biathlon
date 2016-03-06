import { ByWhat } from './models'

export interface IStatQuery {
    statisticId: string;
    statId: string;
    byWhat?: ByWhat;
    genderId?: string;
    seasonId?: string;
    organizerId?: string;
    ibuId?: string;
    nat?: string;
}

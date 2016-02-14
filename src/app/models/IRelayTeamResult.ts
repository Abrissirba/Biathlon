import { IResult } from './models'

export interface IRelayResult {
    teamResult: IResult;
    individualResults: Array<IResult>;
}
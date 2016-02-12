import { IResult } from './models'

export interface IRelayTeamResult {
    teamResult: IResult;
    individualResults: Array<IResult>;
}
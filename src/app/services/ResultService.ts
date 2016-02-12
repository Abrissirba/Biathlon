import { ApiBaseService } from './ApiBaseService'
import { IResult, IRelayTeamResult } from '../models/models'

export class Results extends ApiBaseService<IResult>{
    
    constructor(Restangular: restangular.IService,
        private $q: angular.IQService){
        super("results", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data.Results;
    }

    getList(raceId: string): angular.IPromise<Array<IResult>> {
        var defer = this.$q.defer();
        var isRelay = 
        this.Service.getList<IResult>({
            RaceId: raceId
        }).then((data) => {
            
            data.forEach((result) => {
                result.Rank = parseInt(<any>result.Rank);
                if(isNaN(result.Rank)){
                    switch(result.IRM){
                        case 'DNF':
                            result.Rank = 997;
                            break;
                        case 'DSQ':
                            result.Rank = 998;
                            break;
                        case 'DNS':
                            result.Rank = 999;
                            break;
                    }
                }
            });
            
            defer.resolve(data);
        });
        
        return defer.promise;
    }
    
    parseRelayData(data: Array<IResult>) : Array<IRelayTeamResult> {
        var relayData = new Array<IRelayTeamResult>();
        
        data.forEach((result: IResult) => {
            if(result.Leg === 0) {
                relayData.push({
                    teamResult: result,
                    individualResults: new Array<IResult>()
                });
            }
            else {
                var relayDataEntry: IRelayTeamResult = this.getRelayTeamEntry(result, relayData);
                relayDataEntry.individualResults.push(result);
            }
        });
        
        relayData = relayData.sort((a: IRelayTeamResult, b: IRelayTeamResult) => {
            if(a.teamResult.Rank > b.teamResult.Rank){
                return 1;
            }
            else if(a.teamResult.Rank < b.teamResult.Rank){
                return -1;
            }
            return 0;
        });
        
        return relayData;
    }
    
    getRelayTeamEntry(result: IResult, results: Array<IRelayTeamResult>) : IRelayTeamResult {
        for(var i = 0; i < results.length; i++){
            if(results[i].teamResult.Nat === result.Nat) {
                return results[i];
                break;
            }
        }
    }
}

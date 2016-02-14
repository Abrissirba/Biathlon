import { ApiBaseService } from './ApiBaseService'
import { IResult, IRelayResult } from '../models/models'

/** @ngInject */
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
    
    parseRelayData(data: Array<IResult>) : Array<IRelayResult> {
        var relayData = new Array<IRelayResult>();
        
        data.forEach((result: IResult) => {
            if(result.Leg === 0) {
                relayData.push({
                    teamResult: result,
                    individualResults: new Array<IResult>()
                });
            }
            else {
                var relayDataEntry: IRelayResult = this.getRelayTeamEntry(result, relayData);
                relayDataEntry.individualResults.push(result);
            }
        });
        
        relayData = relayData.sort((a: IRelayResult, b: IRelayResult) => {
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
    
    getRelayTeamEntry(result: IResult, results: Array<IRelayResult>) : IRelayResult {
        for(var i = 0; i < results.length; i++){
            if(results[i].teamResult.Nat === result.Nat) {
                return results[i];
                break;
            }
        }
    }
    
    getFlatRelayResult(relayResults: Array<IRelayResult>) : Array<IResult> {
        var results = new Array<IResult>();
        relayResults.forEach((relayResult: IRelayResult) => {
            results.push(relayResult.teamResult);
            relayResult.individualResults.forEach((result: IResult) => {
                results.push(result);
            })
        });
        
        return results;
    }
}

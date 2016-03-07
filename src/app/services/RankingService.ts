import { IResult, IRelayResult, ICompetition, ICupResult, IEventResult } from '../models/models';
import { Results, Competitions, CupResults } from './services'

/** @ngInject */
export class Rankings {
    Points = [
        60,
        54,
        48,
        43,
        40,
        38,
        36,
        34,
        32,
        31,
        30,
        29,
        28,
        27,
        26,
        25,
        24,
        23,
        22,
        21,
        20,
        19,
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        10,
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1
    ];
    
    constructor(
        private $q: angular.IQService,
        private Competitions: Competitions,
        private Results: Results,
        private CupResults: CupResults
        ){

    }
    
    getEventRanking (eventId: string, seasonId: string, category: string) : angular.IPromise<Array<IEventResult>> {
        var defer = this.$q.defer();
        var promises = [];
        var rankings = new Array<IEventResult>();
        var raceCatId = category === 'women' ? 'SW' : 'SM';
        var cupDescription = category === 'women' ? "Women's World Cup Total Score" : "Men's World Cup Total Score";
        
        this.Competitions.getList(eventId).then((races: Array<ICompetition>) => {
            races.forEach((race: ICompetition) => {
                if (race.catId === raceCatId) {
                    promises.push(this.Results.getList(race.RaceId));
                }
            });
            
            this.$q.all(promises).then((allResults: Array<Array<IResult>>) => {
                allResults.forEach((results: Array<IResult>) => {
                    results.forEach((result: IResult) => {
                        var rank = parseInt(result.Rank);
                        if (rank <= 40) {
                            var ranking = rankings.filter((existingResults: IEventResult) => {
                                return result.IBUId === existingResults.IBUId;
                            })[0];
                            if (ranking) {
                                ranking.Score += this.Points[rank - 1];
                                ranking.RacePositions.push(rank);
                            }
                            else {
                                rankings.push(<any>{
                                    IBUId: result.IBUId,
                                    Score: this.Points[rank - 1],
                                    Name: result.Name,
                                    Nat: result.Nat,
                                    RacePositions: [rank]
                                });
                            }
                        }
                    });
                });
                rankings = rankings.sort((a: IEventResult, b: IEventResult) => {
                    if (a.Score > b.Score) {
                        return -1;
                    }
                    if (a.Score < b.Score) {
                        return 1;
                    }
                    return 0;
                });
                
                this.CupResults.getListBySeasonAndCupResultDescription(seasonId, cupDescription).then((worldCupRankings: Array<ICupResult>) => {
                    rankings.forEach((ranking: IEventResult, index: number) => {
                        ranking.Rank = index + 1;
                        var worldCupRanking = worldCupRankings.filter((worldCupRanking: ICupResult) => {
                            return worldCupRanking.IBUId === ranking.IBUId;
                        })[0];
                        if (worldCupRanking) {
                            ranking.WorldCupRank = parseInt(worldCupRanking.Rank);
                        }
                    });
                    
                    console.log(rankings);
                    defer.resolve(rankings);
                }); 
            });
        });
        
        return defer.promise;
    }
};
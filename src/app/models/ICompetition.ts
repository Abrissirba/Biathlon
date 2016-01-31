export interface ICompetition {
    RaceId: string;
    km: string;
    catId: string;
    DisciplineId: string;
    StatusId: number;
    StatusText: string;
    HasLiveData: boolean;
    IsLive: boolean;
    StartTime: string;
    Description: string;
    ShortDescription: string;
    ResultsCredit: any;
    TimingCredit: any;
    HasAnalysis: boolean;
}
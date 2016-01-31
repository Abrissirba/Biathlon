export interface IStatItem {
    StatisticId: string;
    Description: string;
    ShortDescription: string;
    Explanation: string;
    StatId: string;
    Category: string;
    VisualType: string;
    DisplayOrder: string;
    naviSeasons: boolean;
    naviOrganizers: boolean;
    graphSeasons: boolean;
    byAthlete: boolean;
    AthleteGender: string;
    byNation: boolean;
    SortDescending: boolean;
}
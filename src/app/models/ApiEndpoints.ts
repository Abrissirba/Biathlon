export class ApiEndpoint {
    static athletes = {
        key: "athletes",
        transform: function(data: any){
            return data.Athletes
        }
    };
    static competitions = "competitions";
    static cupResults = "cupresults";
    static cups = "cups";
    static events = "events";
    static factItems = "factitems";
    static organizers = "organizers";
    static results = "results";
    static seasons = "seasons";
    static statItems = "statitems";
    static stats = "stats";
}

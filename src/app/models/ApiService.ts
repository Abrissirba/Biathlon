export class Api {
    
    constructor(private Restangular: restangular.IService) {
        
    }
    
    getAthletes() {
        key: "athletes",
        transform: function(data: any){
            return data.Athletes
        }
    };
    
    static competitions = {
        key: "competitions",
        transform: function(data: any){
            return data;
        }
    };

    static cupResults = {
        key: "cupResults",
        transform: function(data: any){
            return data;
        }
    };
    
    static cups = {
        key: "cups",
        transform: function(data: any){
            return data;
        }
    };
    
    static events = {
        key: "events",
        transform: function(data: any){
            return data;
        }
    };
    
    static factItems = {
        key: "factItems",
        transform: function(data: any){
            return data;
        }
    };
    
    static organizers = {
        key: "organizers",
        transform: function(data: any){
            return data;
        }
    };
    
    static results = {
        key: "results",
        transform: function(data: any){
            return data;
        }
    };
    
    static seasons = {
        key: "seasons",
        transform: function(data: any){
            return data;
        }
    };
    
    static statItems = {
        key: "statItems",
        transform: function(data: any){
            return data;
        }
    };
    
    static stats = {
        key: "stats",
        transform: function(data: any){
            return data;
        }
    };
}

import { ApiBaseService } from './ApiBaseService'
import { IAnalyzeField } from '../models/models'

/** @ngInject */
export class Analysis extends ApiBaseService<IAnalyzeField>{
    
    constructor(Restangular: restangular.IService){
        super("analysis", Restangular);
    }
    
    transformResponse(data: any, response: any) : Array<any>{
        return data.Values;
    }
    
    getList(raceId: string, IBUId: string) : restangular.ICollectionPromise<IAnalyzeField>{
        return this.Service.getList<IAnalyzeField>({
            RaceId: raceId,
            IBUId: IBUId
        });
    }
    
    getFieldType(field: IAnalyzeField) : string{
        // Skiing times
         if(field.FieldId.substr(0, 1) === "A"){
             if(field.FieldId.substr(3, 1) === "C"){
                 return AnalyzeField.Course;
             }
             else if(field.FieldId.substr(3, 1) === "R"){
                 return AnalyzeField.Range;
             }
             else if(field.FieldId.substr(3, 1) === "S"){
                 return AnalyzeField.Lap;
             }
             else if(field.FieldId.substr(3, 1) === "P"){
                 return AnalyzeField.Penalty;
             }
             else if(field.FieldId.substr(3, 1) === "T"){
                 return AnalyzeField.Total;
             }
         }
         // Shooting Times
         else if(field.FieldId.substr(0, 1) === "S"){
             if(field.FieldId.substr(2, 2) === "TM") {
                 return AnalyzeField.ShootingTime;
             }
             if(field.FieldId.substr(2, 2) === "FA") {
                 return AnalyzeField.Shooting;
             }
         }
         // total times
         else if(field.FieldId.substr(0, 1) === "I" && field.FieldId.substr(2, 2) === "SN"){
             return AnalyzeField.Cummulative;
         }
         else if(field.FieldId.substr(0, 4) === "FINN"){
             return AnalyzeField.Cummulative;
         }
         else if(AnalyzeField.progression_5L.indexOf(field.FieldId) > -1){
             return AnalyzeField.ProgressField;
         }
    }
    
    getLapForField(field: IAnalyzeField){
        var type = this.getFieldType(field);
        if(type === AnalyzeField.Course 
            || type === AnalyzeField.Lap 
            || type === AnalyzeField.Range 
            || type === AnalyzeField.Penalty
            || type === AnalyzeField.Total){
            return field.FieldId.substr(2, 1);
        }
        else if((type === AnalyzeField.Cummulative && field.FieldId === 'FINN')){
            return "T";
        }
        return field.FieldId.substr(1, 1);
    }
    
    getLapIndex(code, nrOfLaps = 3) : number {
        if (code === "1") return 0;
        if (code === "2") return 1;
        if (code === "3") return 2;
        if (code === "4") return 3;
        if (code === "5") return 4;
        if (code === "T") return nrOfLaps;
    }
    
    getNrOfLaps(fields: Array<IAnalyzeField>) : number {
        var length = fields.length;
        var laps = 0;
        for (var i = 0; i < length; i++) {
            if(fields[i].FieldId.indexOf("A0") > -1){
                var lapNr = parseInt(fields[i].FieldId[2]);
                if(lapNr && lapNr > laps) {
                    laps = lapNr;
                }
            }
        }
        
        return laps;
    }
    
    getLapFields(fields: Array<IAnalyzeField>) : Array<IAnalyzeField> {
        return fields.filter((field) => {
            return AnalyzeField.LapFields.indexOf(this.getFieldType(field)) > -1;
        });
    }
    
    getProgressionFields(fields: Array<IAnalyzeField>) : Array<IAnalyzeField> {
        return fields.filter((field) => {
            return AnalyzeField.progression_5L.indexOf(field.FieldId) > -1;
        });
    }
    
    getLapAnalyzation(fields: Array<IAnalyzeField>, nrOfLaps: number) : Array<AnalyzeLap>{
        var lapAnalyze = new Array<AnalyzeLap>();
        
        this.getLapFields(fields).forEach((field) => {
            var lapIndex = this.getLapIndex(this.getLapForField(field), nrOfLaps);
            var lap: AnalyzeLap = lapAnalyze[lapIndex] || <AnalyzeLap>{};
            this.parseFieldValue(field);
            lap[this.getFieldType(field)] = field;
            lapAnalyze[lapIndex] = lap;
        });
        
        return lapAnalyze;
    }
    
    getProgressionAnalyzation(fields: Array<IAnalyzeField>, nrOfLaps: number) : Array<IAnalyzeField> {
        var progressionAnalyze = new Array<IAnalyzeField>();
        
        var progressionFieldIds = (nrOfLaps === 3) ? AnalyzeField.progression_3L : AnalyzeField.progression_5L;
        var progressionFields = this.getProgressionFields(fields);

        progressionFieldIds.forEach((progressFieldId) => {
            for (var i = 0; i < progressionFields.length; i++) {
                if (progressionFields[i].FieldId === progressFieldId) {
                    progressionAnalyze.push(progressionFields[i]);
                    break;
                }
            }
        });
        
        return progressionAnalyze;
    }
    
    parseFields(fields: Array<IAnalyzeField>) {
        var nrOfLaps = this.getNrOfLaps(fields);
        var laps = this.getLapAnalyzation(fields, nrOfLaps);
        var progression = this.getProgressionAnalyzation(fields, nrOfLaps);
    }
    
    parseFieldValue(field: IAnalyzeField){
        if(field.Value && field.Value[0] === "="){
            field.Value = field.Value.substr(1);
        }
        if(field.Rank && field.Rank[0] === "="){
            field.Rank = field.Rank.substr(1);
        }
         
    }

}

// AC = Course;
// AR = Range;
// AS = Lap;
// AP = Penalty;
// STM = ShootingTime;
// SFA = Shooting;
// ISN = Cummulative - mellantider;
// FINN = Cummulative Finish;
class AnalyzeField {
    static Course = "Course";
    static Range = "Range";
    static Lap = "Lap";
    static Penalty = "Penalty";
    static ShootingTime = "ShootingTime";
    static Shooting = "Shooting";
    static Cummulative = "Cummulative";
    static Total = "Total";
    static ProgressField = "ProgressField";
    
    static LapFields = [AnalyzeField.Course, AnalyzeField.Range, AnalyzeField.Lap, AnalyzeField.Penalty, AnalyzeField.ShootingTime, AnalyzeField.Shooting, AnalyzeField.Cummulative];

    static progression_3L = ['P11N', 'I11N', 'P12N', 'I12N', 'P1SN', 'R1SN', 'E1SN', 'I1SN',
                         'P21N', 'I21N', 'P22N', 'I22N', 'P2SN', 'R2SN', 'E2SN', 'I2SN',
                         'P31N', 'I31N', 'P32N', 'I32N', 'PFSN', 'FINN'];

    static progression_5L = ['P11N', 'I11N', 'P12N', 'I12N', 'P1SN', 'R1SN', 'E1SN', 'I1SN',
                         'P21N', 'I21N', 'P22N', 'I22N', 'P2SN', 'R2SN', 'E2SN', 'I2SN',
                         'P31N', 'I31N', 'P32N', 'I32N', 'P3SN', 'R3SN', 'E3SN', 'I3SN',
                         'P41N', 'I41N', 'P42N', 'I42N', 'P4SN', 'R4SN', 'E4SN', 'I4SN',
                         'P51N', 'I51N', 'P52N', 'I52N', 'PFSN', 'FINN'];
}

interface AnalyzeLap {
    Course: IAnalyzeField;
    Range: IAnalyzeField;
    Lap: IAnalyzeField;
    Penalty: IAnalyzeField;
    ShootingTime: IAnalyzeField;
    Shooting: IAnalyzeField;
    Cummulative: IAnalyzeField;
    Total: IAnalyzeField;
}
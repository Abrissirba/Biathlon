import { IStatCategory } from '../models/models'

export class ImageService {
    //baseUrl = 'http://ibu.blob.core.windows.net/docs/athletes/';
    baseUrl = 'http://biathlonresults.com/modules/sportapi/biosimage/image?IBUId=';
    
    getImageUrl(IBUId: string) {
        return this.baseUrl + IBUId;
    }
};
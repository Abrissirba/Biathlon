import { IStatCategory } from '../models/models'

export class ImageService {
    baseUrl = 'http://biathlonresults.com/modules/sportapi/biosimage/image?IBUId=';
    
    getImageUrl(IBUId: string) {
        return this.baseUrl + IBUId;
    }
};
import container from "../../container";
import { type Notification } from "../../Data/Models/notificationSchema"
import idValidation from "../Validations/idValidation";
import { Criteria, IdMongo } from "../../Utils/Types/typesMongoose";
import createNotificationValidation from "../Validations/CreatesValidation/createNotificationValidation";
import { CreateNotificationDto } from "typesRequestDtos";
import mongoose from "mongoose";



class NotificationManager {
    private notificationRepository

    constructor(){
        this.notificationRepository = container.resolve('NotificationRepository');
    }
    async getAll(criteria: Criteria){
       return await this.notificationRepository.getAll(criteria)
    }
    async getNotificationById(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.notificationRepository.getNotificationById(id)
    }
    async createNotification(bodyDto:CreateNotificationDto){
        let body = {...bodyDto, appointment_id: new mongoose.Types.ObjectId(bodyDto.appointment_id)}
        await createNotificationValidation.parseAsync(body)
        return await this.notificationRepository.createNotification(body)
    }
    async updateNotification(body:Notification, id:IdMongo){
        await idValidation.parseAsync(id)
        return await this.notificationRepository.updateNotification(body, id)
    }
    async deleteNotification(id: IdMongo){
        await idValidation.parseAsync(id)
        return await this.notificationRepository.deleteNotification(id)
    }
}
export default NotificationManager
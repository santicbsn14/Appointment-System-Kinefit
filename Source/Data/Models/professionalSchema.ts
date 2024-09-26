import mongoose, { Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
export interface Professional {
    user_id: mongoose.Types.ObjectId | string,
    _id?: mongoose.Types.ObjectId,
    specialties: string[]
}

const professionalSchema = new Schema<Professional>({
    user_id: {type: Schema.Types.ObjectId, ref:'users', index: true, required:true},
    specialties:[{type: Schema.Types.String, required: true}]
})
professionalSchema.plugin(paginate)

export default mongoose.model<Professional>('professionals', professionalSchema)
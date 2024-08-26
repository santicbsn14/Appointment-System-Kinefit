import mongoose, { Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
export interface Professional {
    user_id: mongoose.Types.ObjectId,
    _id?: mongoose.Types.ObjectId
}

const professionalSchema = new Schema<Professional>({
    user_id: {type: Schema.Types.ObjectId, ref:'users', index: true, required:true}
})
professionalSchema.plugin(paginate)

export default mongoose.model<Professional>('professionals', professionalSchema)
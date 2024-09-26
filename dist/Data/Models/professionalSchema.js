import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const professionalSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', index: true, required: true },
    specialties: [{ type: Schema.Types.String, required: true }]
});
professionalSchema.plugin(paginate);
export default mongoose.model('professionals', professionalSchema);

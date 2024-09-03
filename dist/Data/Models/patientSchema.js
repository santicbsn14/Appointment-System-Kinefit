import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const patientSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, index: true, ref: 'users', required: true },
    mutual: { type: String, required: false },
    clinical_data: { type: [Schema.Types.Mixed], required: true }
});
if (process.env.NODE_ENV !== 'test') {
    patientSchema.pre(/^find/, function (next) {
        const query = this;
        query.populate('user_id');
        next();
    });
}
patientSchema.plugin(paginate);
export default mongoose.model('patients', patientSchema);

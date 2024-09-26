import mongoose, { Schema } from 'mongoose';
import type { PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface Patient {
    _id?: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId | string;
    mutual?: string;
    clinical_data: unknown[];
}

const patientSchema = new Schema<Patient>({
    user_id: { type: Schema.Types.ObjectId, index: true, ref: 'users', required: true },
    mutual: { type: String, required: false },
    clinical_data: { type: [Schema.Types.Mixed], required: true } 
});

if (process.env.NODE_ENV !== 'test') {
    patientSchema.pre(/^find/, function (next) {
      const query = this as mongoose.Query<any, Patient>;
      query.populate('user_id');
      next();
    });
  }

patientSchema.plugin(paginate);

export default mongoose.model<Patient, PaginateModel<Patient>>('patients', patientSchema);
import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import professionalSchema from './professionalSchema.js';
import patientSchema from './patientSchema.js';
const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, required: true },
    dni: { type: Number, unique: true, required: true },
    role: { type: Schema.Types.ObjectId, index: true, ref: 'roles' },
    homeAdress: { type: String, required: true },
    phone: { type: Number, required: true },
    status: { type: Boolean, default: true },
    password: { type: String, required: true }
});
userSchema.plugin(paginate);
userSchema.pre('findOneAndDelete', async function (next) {
    const user = this; // `this` es la query
    try {
        const doc = await user.model.findOne(this.getFilter()); // Obtener el documento que se está eliminando
        if (doc) {
            // Eliminar profesionales y pacientes asociados al user_id del usuario
            await professionalSchema.deleteMany({ user_id: doc._id });
            await patientSchema.deleteMany({ user_id: doc._id });
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
export default mongoose.model('users', userSchema);

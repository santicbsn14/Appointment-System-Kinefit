import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
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
export default mongoose.model('users', userSchema);

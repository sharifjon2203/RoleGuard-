import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
}, { timestamps: true });

const User = model('User', userSchema);
export default User;

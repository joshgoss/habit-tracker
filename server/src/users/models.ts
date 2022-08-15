import mongoosePkg from 'mongoose';
const { model, Schema } = mongoosePkg;
import { AuthProvider } from '../auth/utils.js';

interface IUser {
    _id:  string,
    firstName: string;
    lastName: string;
    provider: AuthProvider;
    providerUserId: string;
    createdAt: number;
    updatedAt: number;
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true  },
    provider: { type: String, required: true },
    providerUserId: { type: String, required: true },
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);

import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface AuthDocument extends Document {
  username?: string;
  email: string;
  password: string;
  verificationToken?: string;
  verified?: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(userPassword: string): Promise<boolean>;
}

const AuthSchema = new Schema(
  {
    username: {
      type: String,
        trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },  
    image: String,
    verificationToken: String,
    verified: Boolean,
  },
  { timestamps: true }
);

AuthSchema.pre('save', async function (next) {
  const user = this as AuthDocument;
  if (!user.isModified('password')) return next();
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  return next();
});

AuthSchema.methods.comparePassword = async function (userPassword: string) {
  try {
    return await bcrypt.compare(userPassword, this.password);
  } catch (error) {
    return error;
  }
};

export default mongoose.model<AuthDocument>('auths', AuthSchema);
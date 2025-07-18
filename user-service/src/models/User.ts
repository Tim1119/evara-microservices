import mongoose,{Schema,Document} from "mongoose";
import bcrypt from 'bcryptjs';
import { IUser } from "../types";


interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const userSchema = new Schema<IUserDocument>({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true,
        trim:true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[6,'Password must be at least 6 characters']
    },
    firstName:{
        type:String,
        required:[true,'First Name is required'],
        trim: true,
        maxlength: [50, 'First Name cannot exceed 50 characters']
    },
    lastName:{
        type:String,
        required:[true,'Last Name is required'],
        trim: true,
        maxlength: [50, 'Last Name cannot exceed 50 characters']
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'moderator'],
        default: 'customer',
        required: [true, 'User role is required']
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps:true
})


userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with salt rounds of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model<IUserDocument>('User', userSchema);
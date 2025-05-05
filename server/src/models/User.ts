import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRole {
  ADMIN = "admin",
  CANDIDATE = "candidate",
  RECRUITER = "recruiter",
}

enum AccountStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  DEACTIVATED = "deactivated",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  googleId?: string;
  role: UserRole;
  avatarUrl?: string;
  accountStatus?: AccountStatus;
  companyId?: mongoose.Types.ObjectId;
  isEmailVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    firstName: {
      type: String,
      required: [true, "FirstName is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "LastName is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CANDIDATE,
    },
    avatarUrl: String,
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    googleId: {
      type: String,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    isEmailVerified: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// create index on email for faster queries
UserSchema.index({ email: 1 }, { unique: true });

// Virtual field for user's applications
UserSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "candidateId",
  justOne: false,
});

// Virtual field for recruiter's job postings
UserSchema.virtual("jobPostings", {
  ref: "Job",
  localField: "_id",
  foreignField: "postedBy",
  justOne: false,
});

export const User = mongoose.model<IUser>("User", UserSchema);

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRole {
  CANDIDATE = "candidate",
  RECRUITER = "recruiter",
  ADMIN = "admin",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profileData: {
    skills: string[];
    experience: string;
    education: string[];
    resume?: string; // URL to resume file
    location?: string;
    jobPreferences?: string[];
    phone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CANDIDATE,
    },
    profileData: {
      skills: [String],
      experience: String,
      education: [String],
      resume: String,
      location: String,
      jobPreferences: [String],
      phone: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

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
UserSchema.index({ email: 1 });

// create index on skills for AI matching
UserSchema.index({ "profileData.skills": 1 });

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

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

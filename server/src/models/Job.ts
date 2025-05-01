import mongoose, { Document, Schema } from "mongoose";

export enum JobType {
  FULL_TIME = "full-time",
  PART_TIME = "part-time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  REMOTE = "remote",
}

export interface IJob extends Document {
  title: string;
  description: string;
  descriptionText?: string; // optional, can be null
  requirements: string[];
  companyId: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  companyName: string;
  responsibilities: string[];
  location: {
    type: "remote" | "hybrid" | "on-site";
    address?: string; // optional, can be null
    city?: string; // optional, can be null
    country?: string; // optional, can be null
    postalCode?: string; // optional, can be null
  };
  applicationCount: number;
  applicationDeadline?: Date; // optional, can be null
  viewCount: number;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: JobType;
  isActive: boolean;
  tags?: string[]; // for AI-extracted keywords
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: [String],
      required: [true, "Job requirements are required"],
    },
    responsibilities: {
      type: [String],
      required: [true, "Job responsibilities are required"],
    },
    descriptionText: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["remote", "hybrid", "on-site"],
        required: [true, "Job location is required"],
      },
      address: String,
      city: String,
      country: String,
      postalCode: String,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
    applicationDeadline: Date,
    viewCount: {
      type: Number,
      default: 0,
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "USD",
      },
    },
    jobType: {
      type: String,
      enum: Object.values(JobType),
      required: [true, "Job type is required"],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      index: true,
    },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Create compound index for common search patterns
JobSchema.index({
  title: "text",
  descriptionText: "text",
  requirements: "text",
});
JobSchema.index({ jobType: 1 });
JobSchema.index({ companyId: 1, isActive: 1 });
JobSchema.index({ "location.city": 1, "location.country": 1 });
JobSchema.index({ tags: 1 });

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;

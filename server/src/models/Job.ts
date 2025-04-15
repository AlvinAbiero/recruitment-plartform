import mongoose, {Document, Schema} from 'mongoose'

export enum JobType {
    FULL_TIME = 'full-time'
    PART_TIME = 'part-time'
    CONTRACT = 'contract'
    INTERNSHIP = 'internship'
    REMOTE = 'remote'
}

export interface IJob extends Document {
    title: string;
    company: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    location: string;
    salary?: {
        min: number;
        max: number;
        currency: string;
    };
    jobType: JobType;
    postedBy: mongoose.Types.ObjectId;
    isActive: boolean;
    aiTags?: string[]; // for AI-extracted keywords
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
    {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    requirements: {
      type: [String],
      required: [true, 'Job requirements are required']
    },
    responsibilities: {
      type: [String],
      required: [true, 'Job responsibilities are required']
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      index: true
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    jobType: {
      type: String,
      enum: Object.values(JobType),
      required: [true, 'Job type is required'],
      index: true
    },
     postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Job must be posted by a user']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    aiTags: {
      type: [String],
      index: true
    }
  },
  {timestamps: true}
)

// Create compound index for common search patterns
JobSchema.index({title: 'text', description: 'text', 'requirements': 'text'})
JobSchema.index({location: 1, jobType: 1})

const Job = mongoose.model<IJob>('Job', JobSchema);
export default Job;
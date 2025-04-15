import mongoose, { Document, Schema } from 'mongoose';

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show'
}

export interface IInterview extends Document {
  applicationId: mongoose.Types.ObjectId;
  scheduledTime: Date;
  duration: number; // in minutes
  location?: string; // Can be physical or virtual (URL)
  interviewers: mongoose.Types.ObjectId[]; // Recruiter IDs
  status: InterviewStatus;
  notes?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}


const InterviewSchema = new Schema<IInterview>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application ID is required']
    },
    scheduledTime: {
      type: Date,
      required: [true, 'Interview scheduled time is required']
    },
    duration: {
      type: Number,
      required: [true, 'Interview duration is required'],
      min: [15, 'Interview must be at least 15 minutes long']
    },
    location: String,
    interviewers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    status: {
      type: String,
      enum: Object.values(InterviewStatus),
      default: InterviewStatus.SCHEDULED
    },
    notes: String,
    feedback: String
  },
  { timestamps: true }
);

InterviewSchema.index({applicationId: 1})
InterviewSchema.index({scheduledTime: 1});
InterviewSchema.index({'interviewers': 1});

const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
export default Interview;
import mongoose, {Document, Schema} from 'mongoose'

export enum ApplicationStatus {
    APPLIED = 'applied'
    REVIEWING = 'reviewing'
    SHORTLISTED = 'shortlisted'
    INTERVIEW_SCHEDULED = 'interview_scheduled'
    REJECTED = 'rejected'
    HIRED = 'hired'
}


expoet interface IApplication extends Document {
    jobId: mongoose.Types.ObjectId;
    candidateId: mongoose.Types.ObjectId;
    status: ApplicationStatus;
    resume?: string; // url to resume file
    coverLetter?: string;
    aiMatchScore?: number; // AI-calculated match score
    notes?: string; // Recruiter notes
    createdAt: Date;
    updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
    {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required']
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate ID is required']
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED
    },
     resume: String,
    coverLetter: String,
    aiMatchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    notes: string
    },
    {timestamps: true}
)

// Create compound index for candidate's applications and job's applications
ApplicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });
ApplicationSchema.index({ jobId: 1, status: 1 });
ApplicationSchema.index({ candidateId: 1, status: 1 });

const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
export default Application;
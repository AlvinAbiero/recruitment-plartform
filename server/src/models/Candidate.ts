import mongoose, { Document, Schema } from "mongoose";

interface WorkExperience {
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date;
  current: boolean;
  description: string;
  skillsUsed: string[];
}

interface Education {
  institution: string;
  degree?: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  description: string;
}

interface Skill {
  name: string;
  yearsExperience: number;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
}

interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate: Date;
}

interface DesiredSalary {
  min: number;
  max: number;
  currency: string;
  period: "hourly" | "monthly" | "annual";
}

interface Location {
  city: string;
  country: string;
  postalCode: string;
  willingToRelocate: boolean;
}

interface Links {
  portfolio?: string;
  github?: string;
  linkedin?: string;
}

export interface ICandidate extends Document {
  userId: mongoose.Types.ObjectId;
  skills: Skill[];
  resumeFileUrl?: string;
  resumeText: string; // URL to resume file
  experience: WorkExperience[];
  education: Education[];
  certifucations?: Certification[];
  desiredSalary?: DesiredSalary;
  links?: Links;
  location?: Location;
  phone?: string;
  jobPreferences?: string[];
  remotePreference?: "remote-only" | "hybrid" | "on-site" | "flexible";
  tags?: string[];
  matchScores?: {
    jobId: mongoose.Types.ObjectId;
    score: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Sub-schemas
const WorkExperienceSchema = new Schema<WorkExperience>({
  title: String,
  company: String,
  location: String,
  startDate: Date,
  endDate: Date,
  current: Boolean,
  description: String,
  skillsUsed: [String],
});

const EducationSchema = new Schema<Education>({
  institution: String,
  degree: String,
  fieldOfStudy: String,
  startYear: Number,
  endYear: Number,
  description: String,
});

const CandidateSchema = new Schema<ICandidate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    resumeFileUrl: String,
    resumeText: String,
    skills: [
      {
        name: { type: String, required: true },
        yearsExperience: { type: Number, required: true },
        proficiency: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          required: true,
        },
      },
    ],
    experience: [WorkExperienceSchema],
    education: [EducationSchema],
    certifucations: [
      {
        name: String,
        issuingOrganization: String,
        issueDate: Date,
        expirationDate: Date,
      },
    ],
    location: {
      city: String,
      country: String,
      postalCode: String,
      willingToRelocate: Boolean,
    },
    remotePreference: {
      type: String,
      enum: ["remote-only", "hybrid", "on-site", "flexible"],
    },
    desiredSalary: {
      min: Number,
      max: Number,
      currency: String,
      period: { type: String, enum: ["hourly", "monthly", "annual"] },
    },
    jobPreferences: [String],
    links: {
      portfolio: String,
      github: String,
      linkedin: String,
    },
    tags: [String],
    matchScores: [
      {
        jobId: { type: Schema.Types.ObjectId, ref: "Job" },
        score: Number,
      },
    ],
  },
  { timestamps: true }
);

CandidateSchema.index({ "skills.name": 1 });
CandidateSchema.index({ location: "text" }); // For geospatial queries
CandidateSchema.index({ resumeText: "text" }); // For full-text search on resume text
CandidateSchema.index({ tags: 1 }); // For filtering by tags

const Candidate = mongoose.model<ICandidate>("Candidate", CandidateSchema);
export default Candidate;

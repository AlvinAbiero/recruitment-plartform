import mongoose, { Document, Schema } from "mongoose";

interface Location {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  isHeadquarters: boolean;
}

interface Contact {
  phone: string;
  email: string;
  website: string;
}

interface HiringPreferences {
  remotePolicy: "remote-only" | "hybrid" | "on-site" | "flexible";
  visaSponsorship: boolean;
}

export interface ICompany extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  locations: Location[];
  contact: Contact;
  industry?: string;
  companySize?: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1001+";
  hiringPreferences?: HiringPreferences;
  tags?: string[];
  logoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: String,
    industry: String,
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001+"],
    },
    contact: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      website: {
        type: String,
        required: true,
        trim: true,
      },
    },
    locations: [
      {
        address: String,
        city: String,
        country: String,
        postalCode: String,
        isHeadquarters: Boolean,
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    hiringPreferences: {
      remotePolicy: {
        type: String,
        enum: ["remote-only", "hybrid", "on-site", "flexible"],
      },
      visaSponsorship: Boolean,
    },
  },
  { timestamps: true }
);

CompanySchema.index({ tags: 1 });

const Company = mongoose.model<ICompany>("Application", CompanySchema);
export default Company;

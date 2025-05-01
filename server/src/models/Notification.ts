import mongoose, { Document, Schema } from "mongoose";

export enum NotificationType {
  JOB_MATCH = "job_match",
  APPLICATION_UPDATE = "application_update",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_REMINDER = "interview_reminder",
  GENERAL = "general",
}

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  urgencyScore?: number; // AI-calculated score
  relatedEntity?: {
    type: "job" | "application" | "interview" | "candidate" | "company";
    id: mongoose.Types.ObjectId;
  };
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.GENERAL,
    },
    urgencyScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    relatedEntity: {
      type: {
        type: String,
        enum: ["job", "application", "interview", "candidate", "company"],
      },
      id: mongoose.Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    expiresAt: Date,
  },
  { timestamps: true }
);

// Create indexes for querying
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
export default Notification;

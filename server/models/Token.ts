import mongoose, {Document, Schema} from 'mongoose';

export interface IToken extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    type: 'verify' | 'reset';
    expiresAt: Date
}

const TokenSchema = new Schema<IToken>({
     userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['verify', 'reset'],
    required: true,
  },
   expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    },
  },
})

// Create index to automatically expire documents
TokenSchema.index({expiresAt: 1}, {expiresAfterSeconds: 0});

export const Token = mongoose.model<IToken>('Token', TokenSchema)
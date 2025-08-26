import { Schema, model, models } from 'mongoose';

const emailLogSchema = new Schema({
  to: String,
  subject: String,
  htmlContent: String,
  params: Object,
  messageId: String,
  status: String,
  sentAt: { type: Date, default: Date.now },
  error: Object,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
});

export default models.EmailLog || model('EmailLog', emailLogSchema);
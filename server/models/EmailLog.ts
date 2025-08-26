import mongoose from 'mongoose'
import './User'

const emailLogSchema = new mongoose.Schema({
  to: String,
  subject: String,
  htmlContent: String,
  params: Object,
  messageId: String,
  status: String,
  sentAt: { type: Date, default: Date.now },
  error: Object,
  createdBy: { ref: "User", type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
});

const EmailLog = mongoose.models.EmailLog || mongoose.model('EmailLog', emailLogSchema)

export default EmailLog
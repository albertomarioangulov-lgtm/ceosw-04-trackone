import mongoose from 'mongoose'
import autoIncrement from '../utils/autoincrement'

import './Carrier';
import './WR';
import './User';

const crSchema = new mongoose.Schema({
  crId: Number,
  carrier: { ref: 'Carrier', type: mongoose.Schema.Types.ObjectId },
  wr: {
    ref: 'WR', type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  // status: { ref: "WRStatus", type: Schema.Types.ObjectId },
  createdBy: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }
})

crSchema.plugin(autoIncrement({ inc_field: 'crId', start_seq: 12001 }))

crSchema.virtual('packageCount', {
  ref: 'Package',
  localField: '_id',
  foreignField: 'cr',
  count: true
})

const CR = mongoose.models.CR || mongoose.model('CR', crSchema)

export default CR
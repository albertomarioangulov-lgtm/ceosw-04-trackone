import mongoose from 'mongoose'
import AutoIncrement from 'mongoose-sequence'
import Package from './Package';

import './Carrier';
import './WR';
import './User';

// @ts-expect-error
const AutoIncrementPlugin = AutoIncrement(mongoose);

const crSchema = new mongoose.Schema({
  crId: Number,
  carrier: { ref: 'Carrier', type: mongoose.Schema.Types.ObjectId },
  wr: { ref: 'WR', type: mongoose.Schema.Types.ObjectId, required: true },
  // status: { ref: "WRStatus", type: mongoose.Schema.Types.ObjectId },
  createdBy: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }
})

// @ts-expect-error
crSchema.plugin(AutoIncrementPlugin, { inc_field: 'crId', start_seq: 12001 })

crSchema.virtual('packageCount', {
  ref: Package,
  localField: '_id',
  foreignField: 'cr',
  count: true
})

const CR = mongoose.models.CR || mongoose.model('CR', crSchema)

export default CR
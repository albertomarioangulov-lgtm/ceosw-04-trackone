import mongoose from 'mongoose'
import AutoIncrement from 'mongoose-sequence'
import Package from './Package';

// @ts-expect-error
const AutoIncrementPlugin = AutoIncrement(mongoose);

const wrSchema = new mongoose.Schema({
  wrId: Number,
  client: { ref: "Client", type: mongoose.Schema.Types.ObjectId },
  status: { ref: "WRStatus", type: mongoose.Schema.Types.ObjectId },
  createdBy: { ref: "User", type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }
})

// @ts-expect-error
wrSchema.plugin(AutoIncrementPlugin, { inc_field: 'wrId', start_seq: 11001 })

wrSchema.virtual('packageCount', {
  ref: Package,
  localField: '_id',
  foreignField: 'wr',
  count: true
})

const WR = mongoose.models.WR || mongoose.model( 'WR', wrSchema )

export default WR

import mongoose, { Schema, model } from 'mongoose'
import AutoIncrement from 'mongoose-sequence'

// Import referenced models to ensure they are registered with Mongoose before this model is compiled.
import './Package';
import './Client'
import './WRStatus'
import './User'

// @ts-expect-error
const AutoIncrementPlugin = AutoIncrement(mongoose);
// const AutoIncrementPlugin = AutoIncrement({ connection: models.WR?.db });

const wrSchema = new Schema({
  wrId: Number,
  client: { ref: 'Client', type: Schema.Types.ObjectId },
  status: { ref: 'WRStatus', type: Schema.Types.ObjectId },
  createdBy: { ref: 'User', type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }
})

// @ts-expect-error
wrSchema.plugin(AutoIncrementPlugin, { inc_field: 'wrId', start_seq: 11001 })

wrSchema.virtual('packageCount', {
  ref: 'Package',
  localField: '_id',
  foreignField: 'wr',
  count: true
})

const WR = mongoose.models.WR || model( 'WR', wrSchema )

export default WR

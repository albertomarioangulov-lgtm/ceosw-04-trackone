import mongoose, { Schema, model } from 'mongoose'
import AutoIncrement from 'mongoose-sequence'

// @ts-expect-error
const AutoIncrementPlugin = AutoIncrement(mongoose);

const crSchema = new Schema({
  crId: Number,
  carrier: { ref: "Carrier", type: Schema.Types.ObjectId },
  wr: { ref: "WR", type: Schema.Types.ObjectId, required: true },
  // status: { ref: "WRStatus", type: Schema.Types.ObjectId },
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

// @ts-expect-error
crSchema.plugin(AutoIncrementPlugin, { inc_field: 'crId', start_seq: 12001 })

export default model( 'CR', crSchema )
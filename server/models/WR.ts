import mongoose, { Schema, model } from 'mongoose'
import AutoIncrement from 'mongoose-sequence'

// @ts-expect-error
const AutoIncrementPlugin = AutoIncrement(mongoose);

const wrSchema = new Schema({
  wrId: Number,
  client: { ref: "Client", type: Schema.Types.ObjectId },
  status: { ref: "WRStatus", type: Schema.Types.ObjectId },
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

// @ts-expect-error
wrSchema.plugin(AutoIncrementPlugin, { inc_field: 'wrId', start_seq: 11001 })

export default model( 'WR', wrSchema )
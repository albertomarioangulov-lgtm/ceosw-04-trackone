import mongoose, { Schema, model, models } from 'mongoose'
import AutoIncrement from 'mongoose-sequence'

// @ts-expect-error
const AutoIncrementPlugin = AutoIncrement(mongoose);

const packageSchema = new Schema({
  pkgId: Number,
  trkgNum: { type: String, required: true },
  wr: { ref: "WR", type: Schema.Types.ObjectId },
  label: Number,
  weight: Number,
  measures: {
    l: Number,
    w: Number,
    h: Number
  },
  notes: String,
  cr: { ref: "CR", type: Schema.Types.ObjectId },

  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

// @ts-expect-error
packageSchema.plugin(AutoIncrementPlugin, { inc_field: 'pkgId', start_seq: 1 })
// @ts-expect-error
packageSchema.plugin(AutoIncrementPlugin, { id: 'label_seq', inc_field: 'label', start_seq: 1, reference_fields: ['wr'] })

export default models.Package || model( 'Package', packageSchema )
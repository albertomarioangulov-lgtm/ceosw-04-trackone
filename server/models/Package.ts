import { Schema, model } from 'mongoose'

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

export default model( 'Package', packageSchema )
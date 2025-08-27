import mongoose, { Schema, model } from 'mongoose';
import AutoIncrement from 'mongoose-sequence'

import './WR';
import './CR';
import './User';

// @ts-expect-error
const AutoIncrementPlugin = AutoIncrement(mongoose);
// const AutoIncrementPlugin = AutoIncrement({ connection: models.Package?.db });

const packageSchema = new Schema({
  pkgId: Number,
  trkgNum: { type: String, required: true },
  wr: { ref: 'WR', type: Schema.Types.ObjectId },
  label: Number,
  weight: Number,
  measures: {
    l: Number,
    w: Number,
    h: Number
  },
  notes: String,
  cr: { ref: 'CR', type: Schema.Types.ObjectId },

  createdBy: { ref: 'User', type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

// @ts-expect-error
packageSchema.plugin(AutoIncrementPlugin, { inc_field: 'pkgId', start_seq: 1 })
// @ts-expect-error
packageSchema.plugin(AutoIncrementPlugin, { id: 'label_seq', inc_field: 'label', start_seq: 1, reference_fields: ['wr'] })

const Package = mongoose.models.Package || model( 'Package', packageSchema )
export default Package
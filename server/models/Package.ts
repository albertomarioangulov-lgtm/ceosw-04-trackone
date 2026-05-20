import mongoose from 'mongoose';
import autoIncrement from '../utils/autoincrement'

import './WR';
import './CR';
import './User';

const packageSchema = new mongoose.Schema({
  pkgId: Number,
  trkgNum: { type: String, required: true },
  wr: {
    ref: 'WR', type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  client: {
    ref: 'Client', type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  label: Number,
  weight: Number,
  measures: {
    l: Number,
    w: Number,
    h: Number
  },
  notes: String,
  cr: {
    ref: 'CR', type: mongoose.Schema.Types.ObjectId,
    index: true
  },

  createdBy: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

packageSchema.plugin(autoIncrement({ inc_field: 'pkgId', start_seq: 1 }))
packageSchema.plugin(autoIncrement({ id: 'label_seq', inc_field: 'label', start_seq: 1, reference_fields: ['wr'] }))

const Package = mongoose.models.Package || mongoose.model( 'Package', packageSchema )
export default Package
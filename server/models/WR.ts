import mongoose from 'mongoose'
import autoIncrement from '../utils/autoincrement'

// Import referenced models to ensure they are registered with Mongoose before this model is compiled.
import './Client'
import './User'

const wrSchema = new mongoose.Schema({
  wrId: Number,
  client: {
    ref: 'Client', type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'opened', 'finalized'],
  },
  createdBy: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }
})

wrSchema.plugin(autoIncrement({ inc_field: 'wrId', start_seq: 11001 }))

// wrSchema.virtual('packageCount', {
//   ref: 'Package',
//   localField: '_id',
//   foreignField: 'wr',
//   count: true
// })

const WR = mongoose.models.WR || mongoose.model( 'WR', wrSchema )

export default WR

import mongoose, { Schema, model } from 'mongoose'
import AutoIncrement from 'mongoose-sequence'

// @ts-expect-error
const AutoIncrementPlugin = AutoIncrement(mongoose);

const clientSchema = new Schema({
  name: { type: String, required: true },
  // code: { type: String, unique: true },
  dateIn: String,
  seller: { ref: "Seller", type: Schema.Types.ObjectId, required: true },
  poboxid: Number,
  // docNum: { type: String, required: true, unique: true },
  docNum: { type: String },
  docTyp: { type: String },
  country: String,
  state: String,
  city: String,
  phone: String,
  address: String,
  emails: [String],
  email: String,
  contacts: [{
    name: String,
    position: String,
    phone: Number,
    email: String
  }],
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }
})

// @ts-expect-error
clientSchema.plugin(AutoIncrementPlugin, {
    id: 'poboxid_seq',
    inc_field: 'poboxid',
    reference_fields: ['seller']
})

clientSchema.virtual('lastWR', {
  ref: 'WR',
  localField: '_id',
  foreignField: 'client'
})

export default mongoose.models.Client || model( 'Client', clientSchema )
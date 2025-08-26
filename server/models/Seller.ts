import mongoose, { Schema, model, models } from 'mongoose'

const sellerSchema = new Schema({
  name: { type: String, required: true },
  phone: {type: String},
  email: String,
  emails: [{type: String}],
  address: String,
  seller_code: { type: String },
  code: { type: String, required: true, unique: true },
  fee: { type: String, required: true },
  country: String,
  state: String,
  city: String,
  createdBy: { ref: "User", type: Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false
})

const Seller = models.Seller || model( 'Seller', sellerSchema )

export default Seller
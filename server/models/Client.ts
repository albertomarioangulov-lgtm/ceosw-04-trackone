import mongoose from 'mongoose'
import AutoIncrement from 'mongoose-sequence'
// Import referenced models to ensure they are registered with Mongoose before this model is compiled.

import Seller from './Seller';
import User from './User';

// @ts-expect-error
const AutoIncrementPlugin = AutoIncrement(mongoose);

const clientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true // Elimina espacios en blanco al inicio y al final
  },
  dateIn: { 
    type: Date, // Usar el tipo Date es mejor para consultas y formato
    default: Date.now 
  },
  seller: { ref: Seller, type: mongoose.Schema.Types.ObjectId, required: true },
  poboxid: Number,
  // docNum: { type: String, required: true, unique: true },
  docNum: { type: String },
  docTyp: { type: String },
  country: String,
  state: String,
  city: String,
  phone: { type: String }, // String es mejor para números de teléfono (+, -, etc.)
  address: { type: String, trim: true },
  emails: [{
    type: String,
    trim: true,
    lowercase: true // Guardar emails en minúsculas para consistencia
  }],
  email: { // Email principal
    type: String,
    trim: true,
    lowercase: true
  },
  contacts: [{
    name: String,
    position: String,
    phone: String, // String es mejor para números de teléfono
    email: String
  }],
  createdBy: { ref: User, type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }
});

// @ts-expect-error
clientSchema.plugin(AutoIncrementPlugin, {
    id: 'poboxid_seq',
    inc_field: 'poboxid',
    reference_fields: ['seller']
});

// Índice para asegurar unicidad y mejorar rendimiento en búsquedas
clientSchema.index({ seller: 1, poboxid: 1 }, { unique: true });
clientSchema.index({ name: 1 }); // Índice para búsquedas por nombre

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

export default Client
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, default: 0 }
}, {
  strict: false, // Permite guardar campos de referencia (ej. seller, wr) dinámicamente
  versionKey: false
});

// Índice para asegurar búsquedas rápidas por ID y referencias si es necesario
counterSchema.index({ id: 1 });

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

export default Counter;
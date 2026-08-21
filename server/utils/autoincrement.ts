import mongoose from 'mongoose';
import Counter from '../models/Counter';

export interface AutoIncrementOptions {
  id?: string;
  inc_field: string;
  start_seq?: number;
  reference_fields?: string[];
}

export default (options: AutoIncrementOptions) => {
  return (schema: mongoose.Schema) => {
    schema.pre('save', async function () {
      const doc = this;

      // Solo incrementar si es un documento nuevo y el campo no tiene valor aún
      if (!doc.isNew || doc.get(options.inc_field) != null) {
        return;
      }

      // Llave única: usamos el nombre del campo (o el id explícito).
      // Históricamente existían contadores con y sin el sufijo `_seq`,
      // lo que duplicaba secuencias y reiniciaba los consecutivos.
      const counterId = options.id || options.inc_field;
      const query: any = { id: counterId };

      // Manejo de contadores con referencia (scoped sequences)
      if (options.reference_fields) {
        query.reference_value = {};
        for (const field of options.reference_fields) {
          const val = doc.get(field);
          // Si el campo de referencia no está presente, no podemos generar la secuencia correctamente
          if (!val) {
            throw new Error(`El campo de referencia '${field}' es requerido para el auto-incremento`);
          }
          query.reference_value[field] = val;
        }
      }

      try {
        // Dos pasos para evitar el conflicto de $inc + $setOnInsert sobre el mismo campo.
        // Paso 1: si el contador no existe, lo crea arrancando en `start_seq - 1`.
        await Counter.updateOne(
          query,
          { $setOnInsert: { seq: (options.start_seq || 1) - 1 } },
          { upsert: true }
        );
        // Paso 2: incrementa y lee el valor. Nunca reinicia uno existente.
        const counter = await Counter.findOneAndUpdate(
          query,
          { $inc: { seq: 1 } },
          { returnDocument: 'after' }
        );

        doc.set(options.inc_field, counter.seq);
      } catch (err: any) {
        throw err;
      }
    });
  };
};

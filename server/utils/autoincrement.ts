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
        // Buscar y actualizar atómicamente.
        // En un contador nuevo, `$setOnInsert` arranca en `start_seq - 1`
        // y el `$inc` lo deja en `start_seq`. Nunca reinicia uno existente.
        let counter = await Counter.findOneAndUpdate(
          query,
          { $inc: { seq: 1 }, $setOnInsert: { seq: (options.start_seq || 1) - 1 } },
          { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
        );

        doc.set(options.inc_field, counter.seq);
      } catch (err: any) {
        throw err;
      }
    });
  };
};

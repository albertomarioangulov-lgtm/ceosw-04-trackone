// ============================================================
// Modelos de Mongoose - Registro centralizado
// ============================================================
// Este archivo importa todos los modelos para que Mongoose los
// registre al iniciar la aplicación. Esto es crítico para evitar
// el error "MissingSchemaError: Schema hasn't been registered"
// en entornos serverless (App Hosting / Cloud Run) con cold starts.
// ============================================================

import './Counter'
import './EmailLog'
import './Role'
import './User'
import './Carrier'
import './Client'
import './Seller'
import './WR'
import './CR'
import './Package'

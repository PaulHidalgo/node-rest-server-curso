/**
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Database
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

/**
 * Vencimiento del token
 */
//60 seconds
//60 minutes
//24 hours
//30 days
process.env.CADUCIDAD_TOKEN = '48h';

/**
 * Seed de autenticación
 */
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/**
 * Google CLient ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '742436936329-j2tfc1p5va2sq4sfah9t3e3ur4j5hshh.apps.googleusercontent.com'

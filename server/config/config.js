// ===========================
// Puerto
// ===========================

process.env.PORT = process.env.PORT || 3000;


// ===========================
// Entorno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// Base de datos
// ===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ===========================
// VEncimiento del Token
// ===========================
// 60 segundos
// 60 minutos
// 24 Horas
// 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ===========================
// SEED de autentiación
// ===========================

process.env.SEED = process.env.SEED || 'este-es-el-seet-desarrollo';

// ===========================
// Google Client ID
// ===========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '442154804414-c1ch38uafti4ufkt39j562u8a8brlb69.apps.googleusercontent.com';
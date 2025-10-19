const crypto = require('crypto');

console.log('\n🔐 Generando JWT Secrets seguros...\n');
console.log('═══════════════════════════════════════════════════════════\n');
console.log('Copia estos valores en tu archivo .env:\n');
console.log('JWT_ACCESS_SECRET=' + crypto.randomBytes(32).toString('hex'));
console.log('JWT_REFRESH_SECRET=' + crypto.randomBytes(32).toString('hex'));
console.log('\n═══════════════════════════════════════════════════════════');
console.log('✅ Secrets generados correctamente');
console.log('📝 Pega estos valores en tu archivo .env\n');


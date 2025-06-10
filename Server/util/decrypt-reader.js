const fs = require('fs');
const crypto = require('crypto');

const SECRET_KEY = 'mydeckboard'; 

function getKey() {
  return crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substr(0, 32);
}

async function leerJSONEncriptado(path) {
  try {
    const encryptedData = fs.readFileSync(path, 'utf8');
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = getKey();

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (err) {
    console.error('❌ Error al leer JSON encriptado:', err.message);
    throw new Error('No se pudo desencriptar el archivo');
  }
}

module.exports = { leerJSONEncriptado };

#!/usr/bin/env node

/**
 * Extract and display the connection URL for manual entry
 */

const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIP();
const port = process.argv[2] || '8081';

console.log('\n📱 Anslut till Expo Go utan QR-kod:\n');
console.log('═══════════════════════════════════════════════════\n');
console.log('1️⃣  Öppna Expo Go-appen på din telefon\n');
console.log('2️⃣  Tryck på "Enter URL manually" (längst ner)\n');
console.log('3️⃣  Klistra in denna URL:\n');
console.log(`    exp://${ip}:${port}\n`);
console.log('═══════════════════════════════════════════════════\n');
console.log(`💡 Tips: Din dator är på IP ${ip}\n`);

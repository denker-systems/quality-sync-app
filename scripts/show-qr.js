#!/usr/bin/env node

/**
 * Generate a properly formatted QR code for terminal
 * Compensates for terminal aspect ratio (2:1)
 */

const qrcode = require('qrcode-terminal');

// Get the Expo URL from command line or use default
const url = process.argv[2] || 'exp://192.168.1.100:8081';

console.log('\n📱 Scanna QR-koden med Expo Go:\n');

// Generate QR code with small size to compensate for aspect ratio
qrcode.generate(url, { small: true }, (qr) => {
  console.log(qr);
});

console.log(`\n🔗 Eller använd denna länk: ${url}\n`);

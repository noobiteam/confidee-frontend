import CryptoJS from 'crypto-js';

export function encryptData(data: string, password: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, password).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decryptData(encryptedData: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error('Decryption failed');
  }

  return decrypted;
}

export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

export function hashData(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

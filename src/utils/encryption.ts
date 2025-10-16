import CryptoJS from 'crypto-js';

/**
 * Encrypt data using AES encryption
 * @param data - Data to encrypt (string)
 * @param password - Password/key for encryption
 * @returns Encrypted string
 */
export function encryptData(data: string, password: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, password).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES encryption
 * @param encryptedData - Encrypted string
 * @param password - Password/key for decryption
 * @returns Decrypted string
 */
export function decryptData(encryptedData: string, password: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption failed - wrong password or corrupted data');
    }

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Generate a random encryption key
 * @returns Random key string
 */
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

/**
 * Hash data using SHA256
 * @param data - Data to hash
 * @returns Hash string
 */
export function hashData(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

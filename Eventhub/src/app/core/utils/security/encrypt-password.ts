import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

export class EncryptPassword {
  private static key = CryptoJS.enc.Utf8.parse(environment.encryptionKey);
  private static iv = CryptoJS.enc.Utf8.parse(environment.encryptionIv);

  static encryptPassword(password: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(password),
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  static decryptPassword(encryptedPassword: string): string {

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(encryptedPassword)
    });

    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
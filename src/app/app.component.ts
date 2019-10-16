import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private keySize: number = 256;
  private ivSize: number = 128;
  private iterations: number = 100;

  password = "yourkey";

  public encrypt(text: string): string {
    let salt = CryptoJS.lib.WordArray.random(128 / 8);
    let key = CryptoJS.PBKDF2(this.password, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations
    });

    let iv = CryptoJS.lib.WordArray.random(128 / 8);
    let encrypted = CryptoJS.AES.encrypt(text, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
    });
    let transitmessage = salt.toString() + iv.toString() + encrypted.toString();
    return transitmessage;
  }

  public decrypt(text: string): string {
    let salt = CryptoJS.enc.Hex.parse(text.substr(0, 32));
    let iv = CryptoJS.enc.Hex.parse(text.substr(32, 32));
    let encrypted = text.substring(64);

    let key = CryptoJS.PBKDF2(this.password, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations
    });

    let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  constructor() {
  }
}

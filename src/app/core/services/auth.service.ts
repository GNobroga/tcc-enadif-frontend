import { Injectable, OnInit } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from '@firebase/auth';

export const TOKEN_KEY = 'enadif_user_token';

@Injectable({
  providedIn: 'root',
})
export default class AuthService {

    constructor(private auth: Auth) {
      setPersistence(this.auth, browserLocalPersistence);
    }

    async signInDefault(email: string, password: string) {
      try {
        await signInWithEmailAndPassword(this.auth, email!, password!);
        return true;
      } catch(error) {
        console.error(error)
        throw error;
      }
    }


}
import { Injectable, OnInit } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, signOut, updateProfile } from '@firebase/auth';
import UserService from "./user.service";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";

export interface Login {
  email: string;
  password: string;
}

export interface CreateAccount {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export default class AuthService {

  constructor(
    private auth: Auth,
    readonly userService: UserService,
    readonly router: Router,
    readonly navController: NavController,
  ) {
    setPersistence(this.auth, browserLocalPersistence);
  }

  async signIn({ email, password }: Login) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.userService.initializeProgress();
      this.navController.navigateRoot('/tabs');
    } catch(error) {
      console.error(error)
      throw error;
    }
  } 

  async signUp({ name, email, password }: CreateAccount) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      this.userService.initializeProgress();
      await updateProfile(user, { displayName: name });
      this.router.navigate(['/account/created']);
    } catch (error) {
      throw error;
    }
  }



}
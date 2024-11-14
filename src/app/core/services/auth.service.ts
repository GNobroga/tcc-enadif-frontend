import { Injectable, OnInit } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, signOut, updateProfile } from '@firebase/auth';
import UserService from "./user.service";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { lastValueFrom } from "rxjs";

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

  isNewAccount = false;

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
      await lastValueFrom(this.userService.initializeProgress());
      if (this.isNewAccount) {
        this.isNewAccount = false;
        this.navController.navigateRoot('/account/created');
      } else {
        this.navController.navigateRoot('/tabs');
      }
    } catch(error) {
      throw error;
    }
  } 

  async signUp({ name, email, password }: CreateAccount) {
    try {
      this.isNewAccount = true;
      const { user } = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      await updateProfile(user, { displayName: name });
      await this.signIn({ email, password });
    } catch (error) {
      this.isNewAccount = false;
      throw error;
    }
  }



}
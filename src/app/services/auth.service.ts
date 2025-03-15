import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  authError = signal<string | null>(null);

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoading.set(false);
      if (user) {
        this.setUserData(user);
      } else {
        this.currentUser.set(null);
      }
    });
  }

  private setUserData(firebaseUser: FirebaseUser): void {
    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
    };
    this.currentUser.set(user);
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      this.authError.set(null);
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/profile']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      this.authError.set(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/profile']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async registerWithEmail(email: string, password: string): Promise<void> {
    try {
      this.authError.set(null);
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/profile']);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  private handleAuthError(error: any): void {
    const errorMessage = error.message || 'Error de autenticación';
    this.authError.set(errorMessage);
    console.error('Auth error:', error);
  }
}

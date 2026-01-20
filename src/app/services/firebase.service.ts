import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  collectionData,
  query,
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
} from 'firebase/storage';
import { getDocs } from 'firebase/firestore';


@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  //================Autenticacion===========================

  getAuth() {
    return getAuth();
  }
  //============Acceder=============
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //===============Crear usuario=========
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //===========Actualizar usuario==========
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }
  //================Enviar Email Para Reestablecer contraseña===========

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // Logout completo (login normal)
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // Logout silencioso (crear usuarios)
  signOutSilently() {
    return fbSignOut(getAuth());
  }

  //========================= Base de Datos ===============================

  //===========Obtener documentos de una colección=========

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery));
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //=================Setear un documento===============
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //=============Obtener un documento=========
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //=================Agregar un documento===============
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  //=================Eliminar un documento===============
  deleteDocument(path: string) {
    return this.firestore.doc(path).delete();
  }

 async getCollection(path: string): Promise<any[]> {
  const ref = collection(getFirestore(), path);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => doc.data());
}

  //=================Almacenamiento===============

  //====Subir imagen=====
  async uploadImage(path: string, dataUrl: string) {
    return uploadString(ref(getStorage(), path), dataUrl, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }
}


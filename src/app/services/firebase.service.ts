import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  verifyBeforeUpdateEmail
} from 'firebase/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import {
  getFirestore,
  setDoc,
  doc,
  addDoc,
  getDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
  onSnapshot
}  from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { UtilsService } from './utils.service';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject
}  from 'firebase/storage'
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Cooperative } from '../models/cooperative.model';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth)
  firestore = inject(AngularFirestore)
  storage = inject(AngularFireStorage)
  utilsSrv = inject(UtilsService)
  signIn(user: User)
  {
    return signInWithEmailAndPassword(getAuth(),user.email, user.password)
  }

  signOut(){
    return signOut(getAuth())
  }

  signUp(user:User)
  {
    return createUserWithEmailAndPassword(getAuth(),user.email, user.password)
  }



  resetPassword(email:string){
    return sendPasswordResetEmail(getAuth(), email)
  }

  getAuth(){
    return getAuth()
  }

  updateProfile(displayName:string, photoURL?: string)
  {
    const user = getAuth().currentUser
    if(user){
      return updateProfile(user, {displayName, photoURL})
    }else{
      throw new Error('No user is currently signed in. ')
    }
  }

  updateUserPassword(newPassword: string) {
    const user = getAuth().currentUser;
    return updatePassword(user, newPassword)
  }


  addDocument(path:string, data:any)
    {
      return addDoc(collection(getFirestore(),path),data)
    }

  setDocument(path:string,data:any)
  {
    return setDoc(doc(getFirestore(),path),data)
  }

  getCollectionData(path:string, collectionQuery?: any)
  {
    const firestore = getFirestore();
    const ref = collection(firestore, path);
    const q = collectionQuery ? query(ref, ...collectionQuery) : ref;
    return collectionData(q, { idField: 'id' });
  }

  async getDocument(path:string)
  {
    return (await getDoc(doc(getFirestore(),path))).data()
  }

  updateDocument(path:string, data:any)
  {
    return updateDoc(doc(getFirestore(),path),data)
  }

  deleteDocument(path:string)
  {
    return deleteDoc(doc(getFirestore(),path))
  }

  async getFilePath(url:string)
  {
    return ref(getStorage(),url).fullPath
  }

  deleteFile(path:string)
  {
    return deleteObject(ref(getStorage(),path))
  }

  async uploadImage(path:string, data_url:string)
  {
    return uploadString(ref(getStorage(),path),data_url,'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(),path))
      }
    )
  }

  private db = getFirestore();
  listenToUserChanges() {
    const userDocRef = doc(this.db, "users/"+getAuth().currentUser.uid);

    // Suscribirse a los cambios del documento
    onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        // Actualizar el almacenamiento local con los nuevos datos
        this.utilsSrv.saveInLocalStorage('user', userData)
      }
    });
  }

  private cooperativeSubject = new BehaviorSubject<Cooperative | null>(null);
  cooperative$ = this.cooperativeSubject.asObservable();
  // Escuchar cambios en tiempo real desde Firebase
  listenToCooperativeUpdates(cooperativeId: string) {
    this.firestore
      .doc<Cooperative>(`cooperatives/${cooperativeId}`)
      .valueChanges()
      .subscribe((cooperative) => {
        this.cooperativeSubject.next(cooperative);
        // Actualizar localStorage si es necesario
        localStorage.setItem('cooperative', JSON.stringify(cooperative));
      });
  }
}

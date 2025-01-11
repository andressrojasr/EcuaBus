import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Si necesitas autenticación
import 'firebase/compat/firestore'; // Si necesitas Firestore
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class FirebaseSecondaryService {

  secondaryApp: firebase.app.App;

  

  constructor() {
    const firebaseSecondaryConfig = {
      apiKey: "AIzaSyCCOJPX46JW3x3sm7FLQV1sIoNxjDz4XF4",
      authDomain: "citas-barber-28dfc.firebaseapp.com",
      projectId: "citas-barber-28dfc",
      storageBucket: "citas-barber-28dfc.appspot.com",
      messagingSenderId: "584075629946",
      appId: "1:584075629946:web:1017ab295cf5229afe72c3",
      measurementId: "G-YQRCGZY214"
    };

    if (!firebase.apps.some((app) => app.name === 'SecondaryApp')) {
      this.secondaryApp = firebase.initializeApp(firebaseSecondaryConfig, 'SecondaryApp');
    } else {
      this.secondaryApp = firebase.app('SecondaryApp');
    }
   }

   private getSecondaryStorage() {
    return getStorage(this.secondaryApp);
  }

  async getFilePath(url: string): Promise<string> {
    return ref(this.getSecondaryStorage(), url).fullPath;
  }

  async download(url:string){
    const fileRef = ref(this.getSecondaryStorage(), url);
    return getDownloadURL(fileRef);
  }


  // Método para eliminar un archivo
  deleteFile(path: string): Promise<void> {
    const fileRef = ref(this.getSecondaryStorage(), path);
    return deleteObject(fileRef);
  }

  // Método para subir una imagen en formato data_url
  async uploadImage(path: string, data_url: string): Promise<string> {
    const fileRef = ref(this.getSecondaryStorage(), path);
    await uploadString(fileRef, data_url, 'data_url');
    return getDownloadURL(fileRef);
  }

  async getFile(path: string): Promise<string> {
    const storageRef = ref(this.getSecondaryStorage(), path); // Referencia al archivo en Firebase Storage
    try {
      const url = await getDownloadURL(storageRef); // Obtén la URL pública de descarga
      
      // Usando XMLHttpRequest para descargar el archivo
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      
      // Cuando se carga el archivo, manejamos el blob
      xhr.onload = (event) => {
        const blob = xhr.response;  // El archivo en formato Blob
        // Aquí puedes proceder a hacer algo con el Blob, como crear un enlace de descarga
        const fileUrl = window.URL.createObjectURL(blob); // Crea un enlace temporal al Blob
        this.downloadFile(fileUrl, path); // Llamamos a una función para descargar el archivo
      };
      
      xhr.open('GET', url);  // Abre la solicitud GET con la URL obtenida
      xhr.send();  // Envía la solicitud
      
      return url;  // Devolvemos la URL de descarga
    } catch (error) {
      console.error('Error al obtener la URL de descarga:', error);
      throw new Error('Error al obtener la URL de descarga');
    }
  }
  
  // Función para descargar el archivo
  private downloadFile(fileUrl: string, path: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `Archivo_${path}`; // Nombre del archivo a descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // Limpia el objeto URL generado
    window.URL.revokeObjectURL(fileUrl);
  }
  

}

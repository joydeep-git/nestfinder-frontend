import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


class FirebaseService {

  private firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };


  private app = initializeApp(this.firebaseConfig);

  private storage = getStorage(this.app);

  public async uploadImage(file: File, folderName: string): Promise<string> {
    try {

      const imgName = `${folderName}/${new Date().getTime()}_${file.name}`;

      const storageRef = ref( this.storage , imgName);

      const uploadImg = await uploadBytes(storageRef, file);

      return await getDownloadURL(uploadImg.ref);
      
    } catch (error) {
      throw error;
    }
  }

}

export const firebaseService = new FirebaseService();
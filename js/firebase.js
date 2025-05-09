// firebase.js
import { initializeApp }   from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Configuración de Firebase (puedes guardar estos valores en un archivo de configuración para mayor seguridad)
const firebaseConfig = {
    apiKey: "AIzaSyDaBAp23kS7HttX7hLXWuDLPI4NlTDPBuU",
    authDomain: "agromul-web.firebaseapp.com",
    projectId: "agromul-web",
    storageBucket: "agromul-web.firebasestorage.app",
    messagingSenderId: "282023614826",
    appId: "1:282023614826:web:706c04fdd3f3360bd46d13",
    measurementId: "G-W4FMN62599"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);


// Exporta los métodos para ser usados en otros archivos
export { collection,doc, addDoc, getDocs, deleteDoc, setDoc,getAuth, };
// exports de Auth
export { signOut, onAuthStateChanged };
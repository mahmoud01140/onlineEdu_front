import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyCY5q0MPkPDPODSzqSIZuDew8RHMzxK2Q8",

  authDomain: "gooleauth-6cb05.firebaseapp.com",

  projectId: "gooleauth-6cb05",

  storageBucket: "gooleauth-6cb05.firebasestorage.app",

  messagingSenderId: "719852656980",

  appId: "1:719852656980:web:e9a40c2f17e1e0b94510c1",

  measurementId: "G-YQHDBVG2XT"

};


  const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    export { auth, provider };
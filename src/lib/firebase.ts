
#import { initializeApp } from "firebase/app";
#import { getAuth } from "firebase/auth";

#// Your web app's Firebase configuration
#// For Firebase JS SDK v7.20.0 and later, measurementId is optional
#const firebaseConfig = {
 # apiKey: "AIzaSyBsFajLYXxEYRTx6C-5BVWGLv28E-RN61Y",
 # authDomain: "gpttexttools.firebaseapp.com",
 # projectId: "gpttexttools",
 # storageBucket: "gpttexttools.appspot.com",
 # messagingSenderId: "275536338405",
 # appId: "1:275536338405:web:63c9b2876fb24a47c743ca",
 # measurementId: "G-JF7SKEVQ5Q"
};

#// Initialize Firebase
#const app = initializeApp(firebaseConfig);
#export const auth = getAuth(app);
#export default app;

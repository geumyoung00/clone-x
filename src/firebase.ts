import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: 'AIzaSyBO0OnTHPzBOLpkSx891RdZWp_KB_ociB4',
  authDomain: 'clone-x-c2d3c.firebaseapp.com',
  projectId: 'clone-x-c2d3c',
  storageBucket: 'clone-x-c2d3c.firebasestorage.app',
  messagingSenderId: '67320756217',
  appId: '1:67320756217:web:03c935f121c5c86123af28',
  measurementId: 'G-4RG3EPWSER',
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

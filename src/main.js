import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = createApp(App);

const firebaseConfig = {
  apiKey: "AIzaSyBYoFMz8xybMmzCFDA8iSCrHweDkvZFiWw",
  authDomain: "fp-kripto.firebaseapp.com",
  projectId: "fp-kripto",
  storageBucket: "fp-kripto.appspot.com",
  messagingSenderId: "700162838249",
  appId: "1:700162838249:web:da03ccb8482108de71ea78"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

app.config.globalProperties.$firebase = { app: firebaseApp, auth, firestore };

app.use(router);

// Menambahkan guard untuk memeriksa autentikasi sebelum navigasi
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

app.mount('#app');

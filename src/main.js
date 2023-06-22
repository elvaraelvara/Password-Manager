import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = createApp(App);

const firebaseConfig = {
  apiKey: "AIzaSyDoSme6NYkCtznsfv5zEzTU4Jd6pruI3Ww",
  authDomain: "password-manager-82b7c.firebaseapp.com",
  projectId: "password-manager-82b7c",
  storageBucket: "password-manager-82b7c.appspot.com",
  messagingSenderId: "259777009384",
  appId: "1:259777009384:web:ffa4fc6cff3b153bb29b5d"
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

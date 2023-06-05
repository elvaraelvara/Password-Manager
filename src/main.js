import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = createApp(App);

const firebaseConfig = {
  apiKey: "AIzaSyDKMKpZN9BZV3mVjNvwKy6AiWGbjHgqDRk",
  authDomain: "pass-a6741.firebaseapp.com",
  projectId: "pass-a6741",
  storageBucket: "pass-a6741.appspot.com",
  messagingSenderId: "950579145531",
  appId: "1:950579145531:web:c1e3fbf0cce091a036e51e"
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

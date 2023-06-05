<template>
  <div>
    <button v-if="isLoggedIn" @click="logout()">Logout</button>
    <h1>Password Manager</h1>
    <form @submit.prevent="addPassword">
      <label>
        Nama Aplikasi:
        <input type="text" v-model="appName" required />
      </label>
      <br/>
      <label>
        Nama Akun:
        <input type="text" v-model="accountName" required />
      </label>
      <br/>
      <label>
        Password:
        <input type="password" v-model="password" required />
      </label>
      <br/>
      <button type="submit">Simpan</button>
    </form>
    <ul>
      <li v-for="passwordData in passwordList" :key="passwordData.id">
        <div>Nama Aplikasi: {{ passwordData.appName }}</div>
        <div>Nama Akun: {{ passwordData.accountName }}</div>
        <div>Password: {{ passwordData.password }}</div>
        <button @click="deletePassword(passwordData.id)">Hapus</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { AES, enc } from 'crypto-js';
import { getFirestore } from 'firebase/firestore';

export default {
  name: 'Home',
  data() {
    return {
      appName: '',
      accountName: '',
      password: '',
      passwordList: [],
      isLoggedIn: true,
    };
  },
  methods: {
    async addPassword() {
      const encryptedPassword = AES.encrypt(this.password, 'secret').toString();
      const passwordData = {
        appName: this.appName,
        accountName: this.accountName,
        password: encryptedPassword,
      };

      try {
        const docRef = await addDoc(collection(getFirestore(this.$firebase.app), 'passwords'), passwordData);
        passwordData.id = docRef.id;
        this.passwordList.push({
          id: passwordData.id,
          appName: passwordData.appName,
          accountName: passwordData.accountName,
          password: this.password,
        });
        this.appName = '';
        this.accountName = '';
        this.password = '';
      } catch (error) {
        console.error('Error adding password:', error);
      }
    },
    async deletePassword(passwordId) {
      try {
        await deleteDoc(doc(getFirestore(this.$firebase.app), 'passwords', passwordId));
        this.passwordList = this.passwordList.filter(passwordData => passwordData.id !== passwordId);
      } catch (error) {
        console.error('Error deleting password:', error);
      }
    },
    async fetchPasswords() {
      try {
        const querySnapshot = await getDocs(collection(getFirestore(this.$firebase.app), 'passwords'));
        this.passwordList = querySnapshot.docs.map(doc => {
          const decryptedPassword = AES.decrypt(doc.data().password, 'secret').toString(enc.Utf8);
          return {
            id: doc.id,
            appName: doc.data().appName,
            accountName: doc.data().accountName,
            password: decryptedPassword,
          };
        });
      } catch (error) {
        console.error('Error fetching passwords:', error);
      }
    },
    checkLoginStatus() {
    const user = this.$firebase.auth().currentUser;
    if(user) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  },
  logout() {
    // this.$firebase.auth().signOut();
    this.isLoggedIn = false;
    this.$router.push('/login');
  }
  },
  created() {
    this.fetchPasswords();
  },
  mounted() {
  // this.checkLoginStatus();
  // this.$firebase.auth().onAuthStateChanged(() => {
  //   this.checkLoginStatus();
  // });
},
};
</script>
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
    <button v-if="isLoggedIn" @click="deleteAccount()">Hapus Akun</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import { AES, enc } from 'crypto-js';
import { getFirestore } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';

export default {
  name: 'Home',
  data() {
    return {
      appName: '',
      accountName: '',
      password: '',
      passwordList: [],
      isLoggedIn: true,
      userId: '',
    };
  },
  methods: {
    async addPassword() {
      const encryptedPassword = AES.encrypt(this.password, 'secret').toString();
      const passwordData = {
        appName: this.appName,
        accountName: this.accountName,
        password: encryptedPassword,
        userId: this.userId,
      };

      try {
        const docRef = await addDoc(collection(getFirestore(), 'passwords'), passwordData);
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
        await deleteDoc(doc(getFirestore(), 'passwords', passwordId));
        this.passwordList = this.passwordList.filter(passwordData => passwordData.id !== passwordId);
      } catch (error) {
        console.error('Error deleting password:', error);
      }
    },
    async fetchPasswords() {
      try {
        const querySnapshot = await getDocs(collection(getFirestore(), 'passwords'));
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
    async fetchPasswordsByUser() {
      try {
        const querySnapshot = await getDocs(query(collection(getFirestore(), 'passwords'), where('userId', '==', this.userId)));
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
        console.error('Error fetching user passwords:', error);
      }
    },
    checkLoginStatus() {
      const user = getAuth().currentUser;
      if (user) {
        this.isLoggedIn = true;
        this.userId = user.uid;
      } else {
        this.isLoggedIn = false;
        this.userId = '';
      }
    },
    logout() {
      getAuth().signOut();
      this.isLoggedIn = false;
      this.userId = '';
      this.$router.push('/login');
    },
    async deleteAccount() {
      try {
        const user = getAuth().currentUser;
        if (user) {
          // Hapus dokumen password berdasarkan ID pengguna saat ini
          await this.deleteDocsByUser(user.uid);
          
          // Hapus akun saat ini
          await deleteUser(user);
          
          // Reset data pengguna
          this.passwordList = [];
          this.isLoggedIn = false;
          this.userId = '';
          
          console.log('Akun berhasil dihapus');
          this.$router.push('/login');
        } else {
          console.log('Tidak ada pengguna yang terautentikasi');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    },
    async deleteDocsByUser(userId) {
      try {
        const querySnapshot = await getDocs(query(collection(getFirestore(), 'passwords'), where('userId', '==', userId)));
        const batch = writeBatch(getFirestore());
        
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        
        console.log('Dokumen password pengguna berhasil dihapus');
      } catch (error) {
        console.error('Error deleting user password documents:', error);
      }
    }
  },
  created() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.fetchPasswordsByUser();
    }
  },
};
</script>

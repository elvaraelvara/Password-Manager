<template>
  <div class="home">
    <button v-if="isLoggedIn" @click="logout()">Logout</button>
    <button v-if="isLoggedIn" @click="deleteAccount()">Hapus Akun</button>
    <h1>Password Manager</h1>
    <form @submit.prevent="addPassword">
      <label class="aplikasi">
        Nama Aplikasi:
        <input type="text" v-model="appName" required />
      </label>
      <br/>
      <label class="akun">
        Nama Akun:
        <input type="text" v-model="accountName" required />
      </label>
      <br/>
      <label class="password">
        Password:
        <input type="password" v-model="password" required />
      </label>
      <br/>
      <button type="submit">Simpan</button>
    </form>
    <ul>
      <li class="data" v-for="passwordData in passwordList" :key="passwordData.id">
        <div class="outputaplikasi">{{ passwordData.appName }}</div>
        <div class="outputakun">Nama Akun: {{ passwordData.accountName }}</div>
        <div class="outputpass">Password: {{ passwordData.password }}</div>
        <button @click="deletePassword(passwordData.id)">Hapus</button>
      </li>
    </ul>
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

<style>
.home{
display: flex;
flex-direction: column;
align-items: center;
}

.akun input,
.aplikasi input {
border: none;
background-color: #ffffff;
padding: 10px 15px;
font-size: 16px;
border-radius: 5px;
margin: 5px 0;
width: 100%;
}

/* Style untuk container data */
.data {
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
background-color: #f2f2f2;
border-radius: 10px;
padding: 20px;
margin-top: 20px;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
width: 80%;
}

/* Style untuk output aplikasi */
.outputaplikasi {
font-size: 18px;
margin-bottom: 10px;
font-weight: bold;
}

/* Style untuk output akun */
.outputakun {
font-size: 16px;
margin-bottom: 10px;
}

/* Style untuk output password */
.outputpass {
font-size: 16px;
margin-bottom: 20px;
}

/* Style untuk tombol hapus */
button {
background-color: #ff6666;
color: white;
font-size: 16px;
border: none;
border-radius: 5px;
padding: 10px 15px;
cursor: pointer;
transition: all 0.3s ease;
margin-top: 10px;
}

/* Style untuk tombol hapus hover */
button:hover {
background-color: #e60000;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}

/* Style untuk input password */
.password input {
margin-bottom: 20px;
}

/* Style untuk tombol simpan */
button[type='submit'] {
background-color: #4CAF50;
color: white;
font-size: 16px;
border: none;
border-radius: 5px;
padding: 10px 15px;
cursor: pointer;
transition: all 0.3s ease;
margin-top: 20px;
}

/* Style untuk tombol simpan hover */
button[type='submit']:hover {
background-color: #3e8e41;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}

/* Style untuk judul */
h1 {
font-size: 36px;
margin-bottom: 30px;
text-align: center;
}

/* Style untuk tombol logout dan hapus akun */
button {
background-color: #ff6666;
color: white;
font-size: 16px;
border: none;
border-radius: 5px;
padding: 10px 15px;
cursor: pointer;
transition: all 0.3s ease;
margin-top: 20px;
}

/* Style untuk tombol logout dan hapus akun hover */
button:hover {
background-color: #e60000;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}
</style>

<template>
  <div>
    <h1>Signup</h1>
    <div class="signup-box">
    <form @submit.prevent="showPopup">
      <label>
        Email:
        <input type="email" v-model="email"/>
      </label>
      <br/>
      <label>
        Password:
        <input type="password" v-model="password"/>
      </label>
      <br/>
      <button type="submit">Signup</button>
    </form>
  </div>

    <!-- Pop-up Persyaratan -->
    <div v-if="showRequirementPopup" class="requirement-popup">
      <h2>Silakan setujui persyaratan sebelum melanjutkan!</h2>
      <ul>
        <li v-for="requirement in requirements" :key="requirement.id">
          <label>
            <input type="checkbox" v-model="requirement.checked" :required="!allRequirementsChecked"/>
            {{ requirement.text }}
          </label>
        </li>
      </ul>
      <button @click="closePopup">OK</button>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'Signup',
  
  data() {
    return {
      email: '',
      password: '',
      showRequirementPopup: false,
      requirements: [
        {
          id: 1,
          text: 'Persyaratan izin sukarela: Untuk mendaftar, diperlukan izin sukarela dan jelas dari individu dengan pemahaman penuh tentang tujuan pengumpulan dan penggunaan data pribadi.',
          checked: false
        },
        {
          id: 2,
          text: 'Persyaratan informasi yang jelas: Saat mendaftar, pihak yang mengumpulkan data pribadi harus memberikan informasi yang jelas tentang identitas, tujuan pengumpulan data, jenis data yang dikumpulkan, serta hak individu terkait data pribadi.',
          checked: false
        },
        {
          id: 3,
          text: 'Persyaratan penjelasan tujuan penggunaan data: Penggunaan data harus dijelaskan secara terperinci saat mendaftar dan terbatas pada tujuan yang telah dijelaskan, tidak boleh digunakan untuk tujuan lain tanpa izin tambahan.',
          checked: false
        },
        {
          id: 4,
          text: 'Persyaratan perlindungan terhadap penggunaan tidak sah: Saat mendaftar, data pribadi harus dilindungi dari penggunaan yang tidak sah, termasuk penggunaan komersial tanpa izin, penjualan kepada pihak ketiga, atau penggunaan yang merugikan individu.',
          checked: false
        },
        {
          id: 5,
          text: 'Persyaratan hak untuk menarik izin: Setelah mendaftar, individu memiliki hak untuk menarik izin mereka terhadap pengumpulan atau penggunaan data pribadi dengan mudah, dan data harus dihapus atau tidak lagi digunakan setelah izin dicabut.',
          checked: false
        },
        {
          id: 6,
          text: 'Persyaratan perlindungan anak-anak: Untuk mendaftar, persyaratan khusus diterapkan untuk melindungi data pribadi anak-anak, termasuk membutuhkan izin dari orang tua sebelum mengumpulkan data mereka.',
          checked: false
        },
      ]
    }
  },
  
  computed: {
    allRequirementsChecked() {
      return this.requirements.every(requirement => requirement.checked);
    }
  },
  
  methods: {
    showPopup() {
      if (!this.allRequirementsChecked) {
        this.showRequirementPopup = true;
      } else {
        this.signup();
      }
    },
    
    closePopup() {
      if (this.allRequirementsChecked) {
        this.signup();
        this.showRequirementPopup = false;
      } else {
        alert('Anda harus menyetujui semua persyaratan sebelum melanjutkan.');
      }
    },
    
    signup() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          this.$router.push('/login');
        })
        .catch(error => {
          alert(error.message);
        });
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  background-color: #f5f5f5;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  background-color: #fff;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  margin-bottom: 100px;
  margin-top: 40px;
}

h1 {
  font-size: 36px;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.signup-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  width: 100%;
}

input[type="email"], input[type="password"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  outline: none;
}

button[type="submit"] {
  background-color: #37b8af;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 100%;
}

button[type="submit"]:hover {
  background-color: #2c9a91;
}

.requirement-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.requirement-popup h2 {
  font-size: 24px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
}

.requirement-popup ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.requirement-popup li {
  font-size: 16px;
  color: #fff;
  margin-bottom: 10px;
}

.requirement-popup label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
}

.requirement-popup input[type="checkbox"] {
  margin-right: 10px;
}

.requirement-popup button {
  background-color: #fff;
  color: #37b8af;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.requirement-popup button:hover {
  background-color: #f9f9f9;
}

</style>

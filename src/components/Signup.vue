<template>
  <div>
    <h1>Signup</h1>
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

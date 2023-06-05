<template>
  <div>
    <h1>Signup</h1>
    <form @submit.prevent="signup">
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
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'Signup',
  
  data() {
    return {
      email: '',
      password: '',
    }
  },
  
  methods: {
    signup() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password).then(() => {
        this.$router.push('/login');
      }).catch(error => {
        alert(error.message);
      });
    }
  }
}
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login">
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
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'Login',
  
  data() {
    return {
      email: '',
      password: '',
    }
  },
  
  methods: {
    login() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password).then(() => {
        this.$router.push('/');
      }).catch(error => {
        alert(error.message);
      });
    }
  }
}
</script>

<style>
.login{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

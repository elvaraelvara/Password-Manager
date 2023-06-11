<template>
  <div class="login">
    <!-- <header v-if="!isLoggedIn">
      <nav>
        <router-link to="/login">Login</router-link>
        <router-link to="/signup">Register</router-link>
      </nav>
    </header>
    <main>
      <router-view/>
    </main> -->
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
      isLoggedIn: false,
      email: '',
      password: '',
    }
  },
  
  methods: {
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
    login() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password).then(() => {
        this.$router.push('/');
      }).catch(error => {
        alert(error.message);
      });
    }
  },
  mounted() {
    this.checkLoginStatus();
    // getAuth().onAuthStateChanged(() => {
    //   this.checkLoginStatus();
    // });
  },
}
</script>

<style>
* {
  box-sizing: border-box;
}

.login{
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav {
  background: linear-gradient(to right, #42b983, #88d7ce);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
}

nav a {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  margin-right: 30px;
  transition: all 0.3s ease-in-out;
}

nav a:hover {
  transform: scale(1.05);
  color: #42b983;
}

nav a.router-link-exact-active {
  color: #fff;
  border-bottom: 2px solid #fff;
}

router-view {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>


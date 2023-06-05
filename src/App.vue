<template>
  <div id="app">
    <header>
      <nav>
        <!-- <router-link to="/">Home</router-link> -->
        <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/signup">Signup</router-link>
        <a v-if="isLoggedIn" @click="logout()">Logout</a>
      </nav>
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>

export default {
  name: 'App',
  
  data() {
    return {
      isLoggedIn: false,
    }
  },
  
  methods: {
  checkLoginStatus() {
    const user = this.$firebase.auth().currentUser;
    if(user) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  },
  
  logout() {
    this.$firebase.auth().signOut();
    this.isLoggedIn = false;
    this.$router.push('/login');
  }
},

mounted() {
  this.checkLoginStatus();
  this.$firebase.auth().onAuthStateChanged(() => {
    this.checkLoginStatus();
  });
},

}
</script>


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

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  color: #2c3e50;
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

<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/log" v-show="!this.$route.params.day">Nova Entrada</router-link>
      <router-link :to="`/log?day=${this.$route.params.day}`" v-show="this.$route.params.day">Nova Entrada</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
body, a {
  color: #2c3e50 !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #40B7AD !important;
}
</style>

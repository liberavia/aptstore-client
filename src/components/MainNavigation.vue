<template>
  <div>
    <b-navbar id="navbar" toggleable="md" type="dark" variant="dark">
      <b-navbar-brand to="/">
        <img class="navbar-logo" src="../assets/logo.png" alt="Aptstore Logo">
      </b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item to="/">Home</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="d-none d-md-block mx-auto">
        <b-form-input placeholder="Search App..."></b-form-input>
      </b-navbar-nav>
      <b-navbar-nav>
        <b-nav-item-dropdown text="Settings" variant="dark">
          <b-dropdown-item @click="openGeneralSettings()">General settings...</b-dropdown-item>
          <b-dropdown-item @click="openManagePlatforms()">Manage platforms...</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Lang" variant="dark">
          <b-dropdown-item @click="changeLangTo('en')">EN</b-dropdown-item>
          <b-dropdown-item @click="changeLangTo('de')">DE</b-dropdown-item>
          <b-dropdown-item @click="changeLangTo('es')">ES</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div>  
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'MainNavigation',
  components: {
  },
  props: {
  },
  data() {
    return {
    };
  },
  methods: {
      changeLangTo(language) {
          alert(`Change language to ${language}`);
      },
      openGeneralSettings() {
          alert("Open general settings");
      },
      openManagePlatforms() {
          alert("Open manage platforms");
      },
  },
});
</script>

<style scoped>
  .navbar-logo {
    width: 50px;
  }
</style>
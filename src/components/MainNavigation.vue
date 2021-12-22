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
        <b-button size="lg" class="mb-2" variant="dark">
          <b-icon icon="gear-fill" @click="openGeneralSettings()" aria-hidden="true"></b-icon>
        </b-button>
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
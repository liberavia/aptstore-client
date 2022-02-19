<template>
  <div>
    <b-navbar id="navbar" toggleable="md" type="dark" variant="dark">
      <b-navbar-brand to="/">
        <img class="navbar-logo" src="../assets/logo.png" alt="Aptstore Logo">
      </b-navbar-brand>
      <b-navbar-nav>
        <b-button 
          size="lg" 
          class="mb-2" 
          variant="dark"
          @click="goBack()"
        >
          <b-icon icon="chevron-left" aria-hidden="true"></b-icon>
        </b-button>
      </b-navbar-nav>
      <b-navbar-nav>
        <b-nav-item to="/">Home</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="d-none d-md-block mx-auto">
        <b-form-input placeholder="Search App..."></b-form-input>
      </b-navbar-nav>
      <b-navbar-nav>
        <b-button size="lg" class="mb-2" variant="dark" v-b-modal.settings-modal>
          <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
        </b-button>
      </b-navbar-nav>
    </b-navbar>
    <SettingsModal />
  </div>  
</template>

<script>
  import Vue from 'vue';
  import SettingsModal from './SettingsModal.vue'

  export default Vue.extend({
    name: 'MainNavigation',
    components: {
      SettingsModal
    },
    props: {
    },
    data() {
      return {
        tabSettingsIndex: 0,
      };
    },
    methods: {
        changeLangTo(language) {
            alert(`Change language to ${language}`);
        },
        linkSettingsTabClass(idx) {
          if (this.tabSettingsIndex === idx) {
            return ['bg-light', 'text-dark']
          } else {
            return ['bg-dark', 'text-light']
          }
        },
        goBack() {
          this.$router.go(-1);
        }, 
    },
  });
</script>

<style scoped>
  .navbar-logo {
    width: 50px;
  }
</style>
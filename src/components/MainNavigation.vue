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
    <b-modal 
      id="settings-modal"
      size="lg"
      title="Settings"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
    >
      <template #modal-header>
        <h5>Settings</h5>
      </template>
      <template #default>
        <b-card no-body>
          <b-tabs pills card vertical v-model="tabSettingsIndex">
            <b-tab title="General" :title-link-class="linkSettingsTabClass(0)" active>
              <b-card-text>Content general settings</b-card-text>
            </b-tab>
            <b-tab title="Platforms" :title-link-class="linkSettingsTabClass(1)">
              <b-card-text>Content platform settings</b-card-text>
            </b-tab>
            <b-tab title="Misc" :title-link-class="linkSettingsTabClass(2)">
              <b-card-text>Content miscellaneous settings</b-card-text>
            </b-tab>
          </b-tabs>
        </b-card>
      </template>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="success" @click="ok()">
          OK
        </b-button>
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>    
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
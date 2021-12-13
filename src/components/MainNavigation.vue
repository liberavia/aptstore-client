<template>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">NavBar</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>

            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item @click="changeLangTo('en')">EN</b-dropdown-item>
              <b-dropdown-item @click="changeLangTo('de')">DE</b-dropdown-item>
              <b-dropdown-item @click="changeLangTo('es')">ES</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>Settings</em>
              </template>
              <b-dropdown-item @click="openGeneralSettings()">General settings...</b-dropdown-item>
              <b-dropdown-item @click="openManagePlatforms()">Manage platforms...</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
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

<template>
  <div>
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
              <b-card-text>
                <div>
                  <b-form-group
                    label="Systray"
                  >
                    <b-form-checkbox 
                      v-model="settings.general.systray_enable" 
                      switch 
                      size="lg"
                    >
                      Enable Systray
                    </b-form-checkbox>                
                    <b-form-checkbox 
                      v-model="settings.general.systray_closeto" 
                      switch 
                      size="lg"
                    >
                      Close to Systray
                    </b-form-checkbox>
                  </b-form-group>  
                </div>
              </b-card-text>
            </b-tab>
            <b-tab title="Platforms" :title-link-class="linkSettingsTabClass(1)">
              <b-card-text>
                <b-form-group
                  label-cols-lg="3"
                  label="Steam"
                  label-size="lg"
                  label-class="font-weight-bold pt-0"
                  class="mb-0"
                >
                  <b-form-group
                    label="Steam username:"
                    label-for="nested-steamuser"
                    label-cols-sm="3"
                    label-align-sm="right"
                  >
                    <b-form-input 
                      id="nested-steamuser"
                      v-model="settings.platforms.steam.username"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Steam password:"
                    label-for="nested-password"
                    label-cols-sm="3"
                    label-align-sm="right"
                  >
                    <b-form-input 
                      id="nested-password" 
                      type="password"
                      v-model="settings.platforms.steam.password"
                    ></b-form-input>
                  </b-form-group>
                </b-form-group>
              </b-card-text>
            </b-tab>
            <b-tab title="Misc" :title-link-class="linkSettingsTabClass(2)">
              <b-card-text>Content miscellaneous settings</b-card-text>
            </b-tab>
          </b-tabs>
        </b-card>
      </template>
      <template #modal-footer="{ cancel }">
        <b-button size="sm" variant="success" @click="saveCurrentSettings()">
          OK
        </b-button>
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>
    <div v-if="savedSuccessfully"></div>    
    <div v-if="savingFailed"></div>    
    <div v-if="loadedSuccessfully"></div>    
    <div v-if="loadingFailed"></div>    
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SettingsModal',
  components: {
  },
  data() {
    return {
        tabSettingsIndex: 0,
    };
  },
  mounted() {
      this.$nextTick(function () {
          this.loadSettings();
      });
  },
  methods: {
    ...mapActions([
      'loadSettings', 
      'saveSettings',
      'resetLoadedState',
      'resetLoadedFailedState',
      'resetSavedState',
      'resetSavedFailedState',
    ]),
    saveCurrentSettings() {
        this.saveSettings(this.settings);
        this.$bvModal.hide('settings-modal');
    },
    linkSettingsTabClass(idx) {
      if (this.tabSettingsIndex === idx) {
        return ['bg-light', 'text-dark']
      } else {
        return ['bg-dark', 'text-light']
      }
    },
    makeToast(title, message, variant='default') {
      // @todo: currently toast disappears immidiatly
      // seems to relate to bootstrap5, maybe downgrading to 4 is the solution?
      this.$bvToast.toast(message, {
        title: title,
        variant: variant,
        autoHideDelay: 5000,
        appendToast: true,
        static: true
      })
    },
  },
  computed: {
    settings: {
      get() {
        const storedSettings = this.$store.state.settings_state.settings;
        let storedSettingsJson = storedSettings;
        if (typeof storedSettings == 'string') {
          storedSettingsJson = JSON.parse(storedSettings);
        }

        return storedSettingsJson;
      },
      set(value) {
        this.saveSettings(value);
      },
    },
    loadedSuccessfully() {
        const loaded = this.$store.state.settings_state.loaded;
        if (loaded) {
          this.makeToast('Success!', 'Successfully loaded settings', 'success');
          this.resetLoadedState();
        }
        return loaded;
    },
    loadingFailed() {
        const loaded_failed = this.$store.state.settings_state.loaded_failed;
        if (loaded_failed) {
          this.makeToast('Error', 'Loading settings failed', 'error');
          this.resetLoadedFailedState();
        }

        return loaded_failed;
    },
    savedSuccessfully() {
        const saved = this.$store.state.settings_state.saved;
        if (saved) {
          this.makeToast('Success!', 'Successfully saved settings', 'success');
          this.resetSavedState();
        }

        return saved;
    },
    savingFailed() {
        const saved_failed = this.$store.state.settings_state.saved_failed;
        if (saved_failed) {
          this.makeToast('Error', 'Saving settings failed', 'error');
          this.resetSavedFailedState();
        }

        return saved_failed;
    },        
  }
};
</script>

<style>

</style>
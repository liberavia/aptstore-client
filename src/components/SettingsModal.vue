<template>
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
                  <b-form-input id="nested-steamuser"></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Steam password:"
                  label-for="nested-password"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input type="password" id="nested-password"></b-form-input>
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
    <template #modal-footer="{ ok, cancel }">
      <b-button size="sm" variant="success" @click="ok()">
        OK
      </b-button>
      <b-button size="sm" @click="cancel()">
        Cancel
      </b-button>
    </template>
  </b-modal>    
</template>

<script>
  export default {
    name: 'SettingsModal',
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
      linkSettingsTabClass(idx) {
        if (this.tabSettingsIndex === idx) {
          return ['bg-light', 'text-dark']
        } else {
          return ['bg-dark', 'text-light']
        }
      },
    },
  };
</script>

<style>

</style>
<template>
    <div class="col align-self-end">
        <div class="row">
            <div class="col">
                <select 
                    class="form-select"
                    v-model="selectedPlatform"
                >
                    <option
                        class="form-select"
                        v-for="platform in currentApp.platforms"
                        :key="platform"
                        v-bind:value="platform"
                    >{{ platform }}</option>
                </select>
            </div>
            <div v-if="isInstalled()" class="col">
                <b-button variant="danger" @click="removeApp()">Remove</b-button>
                <b-button variant="warning" @click="launchApp()">Launch</b-button>                                
            </div>
            <div v-else class="col">
                <b-button variant="success" @click="installApp()">Install</b-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DetailsActions',
    props: ['currentApp', 'selectedPlatform'],
    methods: {
        isInstalled() {
            return true;
        },
        removeApp() {
            alert(`default is ${this.currentApp.platforms[0]}`)
            alert(`remove ${this.selectedPlatform}-App`);
        },
        launchApp() {
            alert(`launch ${this.selectedPlatform}-App`);
        },
        installApp() {
            alert(`install ${this.selectedPlatform}-App`);
        },
    },
}
</script>

<style>

</style>
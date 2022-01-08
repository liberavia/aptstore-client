<template>
    <b-overlay :show="installedStateLoading" variant="dark">
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
                <div v-if="isInstalled" class="col">
                    <b-button variant="danger" @click="removeApp()">Remove</b-button>
                    <b-button variant="warning" @click="launchApp()">Launch</b-button>                                
                </div>
                <div v-else class="col">
                    <b-button variant="success" @click="installApp()">Install</b-button>
                </div>
            </div>
        </div>
    </b-overlay>
</template>

<script>
export default {
    name: 'DetailsActions',
    props: ['currentApp', 'selectedPlatform'],
    data() {
        return {
            installedStateLoading: true,
            isInstalled: false,
        }
    },
    mounted() {
        console.log(this.currentApp);
        console.log(this.selectedPlatform);
        this.$nextTick(function () {
            window.ipcRenderer.receive('response:file:home:exists', (e, fileExists) => {
                console.log(`response:file:home:exists DATA: ${fileExists}`);
                if (fileExists) {
                    this.isInstalled = true;
                }
                this.installedStateLoading = false;
            });
            const pathBaseDir = '/.aptstore/reports/installed/';
            let pathPlatform = `${this.selectedPlatform}/`;
            if (this.selectedPlatform == 'proton') {
                pathPlatform = 'steam/';
            }
            const installedDir = pathBaseDir + pathPlatform;
            const filePath = installedDir + `${this.currentApp.ident}.json`;

            window.ipcRenderer.send('check:file:home:exists', filePath);
        });
    },
    methods: {
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

<style scoped>
    .form-select {
        background-color: #212529;
        color: white;
        border-color: #333;
    };
    .rating {
        background-color: #212529 !important;
    };
</style>
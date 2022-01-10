<template>
    <b-overlay :show="determineAppStateLoading" variant="dark">
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
                    <b-button variant="danger" @click="appAction('remove')">Remove</b-button>
                    <b-button variant="warning" @click="appAction('launch')">Launch</b-button>                                
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
            determineAppStateLoading: true,
            isInstalled: false,
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.determineAppState();
            this.checkInstalled();
        });
    },
    methods: {
        determineAppState() {

        },
        checkInstalled() {
            window.ipcRenderer.receive('response:file:home:exists', (e, fileExists) => {
                console.log(`response:file:home:exists DATA: ${fileExists}`);
                if (fileExists) {
                    this.isInstalled = true;
                }
                this.determineAppStateLoading = false;
            });
            const pathBaseDir = '/.aptstore/reports/installed/';
            let pathPlatform = `${this.selectedPlatform}/`;
            if (this.selectedPlatform == 'proton') {
                pathPlatform = 'steam/';
            }
            const installedDir = pathBaseDir + pathPlatform;
            const filePath = installedDir + `${this.currentApp.ident}.json`;

            window.ipcRenderer.send('check:file:home:exists', filePath);
        },
        installApp() {
            const queueElement = {
                action: 'install',
                platform: this.selectedPlatform,
                ident: this.currentApp.ident,
                name: this.currentApp.name,
                login: 'someLogin',
                secret: 'someSecret'
            };
            this.addToQueue(queueElement);
        },
        appAction(action) {
            const ipcChannel = `apstore:core:${this.selectedPlatform}:${action}`;

            window.ipcRenderer.receive(`response:${ipcChannel}`, (e, currentState) => {
                if (currentState == 'started') {
                    this.determineAppStateLoading = true;
                }
                if (currentState == 'finished') {
                    this.determineAppStateLoading = false;
                }
            });
            
            const ipcSendParams = {
                ident: this.currentApp.ident,
                login: 'someLogin',
                secret: 'someSecret'
            }

            window.ipcRenderer.send(ipcChannel, ipcSendParams);
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
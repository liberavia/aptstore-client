<template>
    <b-overlay :show="appIsProcessing()" variant="dark">
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
        <template #overlay>
            <div v-if="isInQueue" class="text-center">
                <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
                <p id="cancel-label">In queue for {{ queueAction }}</p>
                <b-button
                    ref="cancel"
                    variant="outline-danger"
                    size="sm"
                    aria-describedby="cancel-label"
                    @click="cancelQueue()"
                >
                    Cancel
                </b-button>
            </div>
            <div v-if="isInProgress" class="text-center">
                <p>{{ progressData.status_message }}</p>
                <b-progress 
                    :value="progressData.percent_done" 
                    :max="progressMax" 
                    animated
                ></b-progress>
                <b-button
                    ref="cancel"
                    variant="outline-danger"
                    size="sm"
                    aria-describedby="cancel-label"
                    @click="cancelProgress()"
                >
                    Cancel
                </b-button>
            </div>
        </template>        
    </b-overlay>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'DetailsActions',
    props: ['currentApp', 'selectedPlatform'],
    data() {
        return {
            isInstalled: false,
            queueAction: '',
            progressData: {},
            progressMax: 100,
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.checkInstalled();
        });
    },
    methods: {
        ...mapActions(['addToQueue']),
        checkInstalled() {
            window.ipcRenderer.receive('response:file:home:exists', (e, fileExists) => {
                console.log(`response:file:home:exists DATA: ${fileExists}`);
                if (fileExists) {
                    this.isInstalled = true;
                }
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
        removeApp() {
            const queueElement = {
                action: 'remove',
                platform: this.selectedPlatform,
                ident: this.currentApp.ident,
                name: this.currentApp.name,
                login: 'someLogin',
                secret: 'someSecret'
            };
            this.addToQueue(queueElement);
        },
        launchApp() {
            alert('Launching app not yet implemented');
        },
        appIsProcessing() {
            return (this.isInQueue || this.isInProgress);
        },
        cancelQueue() {
            alert('cancel queue not yet implemented');
        },
        cancelProgress() {
            alert('cancel progress not yet implemented');
        },
    },
    computed: { 
        isInQueue() {
            const newQueue = this.$store.state.queue;
            let inQueue = false;
            newQueue.forEach(element => {
                if (element.ident === this.currentApp.ident) {
                    inQueue = true;
                    this.queueAction = element.action;
                }
            });

            if (!inQueue) {
                this.checkInstalled();
            }

            return inQueue;
        },
        isInProgress() {
            const newProgress = this.$store.state.queue;
            let inProgress = false;
            newProgress.forEach(element => {
                if (element.app_ident === this.currentApp.ident) {
                    inProgress = true;
                    this.progressData = element;
                }
            });

            if (!inProgress) {
                this.checkInstalled();
            }

            return inProgress;
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
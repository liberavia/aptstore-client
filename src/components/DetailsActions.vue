<template>
    <b-overlay :show="(isInProgress || isInQueue || isLoadingNewTask)" variant="dark" opacity="0.8">
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
            <b-card 
                v-if="isInProgress" 
                header-tag="header" 
                footer-tag="footer"
            >
                <template #header>
                    <h6 class="mb-0">{{ progressData.status_message }}</h6>
                </template>
                <b-card-text>
                        <b-progress 
                            :value="progressData.percent_done" 
                            :max="progressMax" 
                            show-progress
                            animated
                        ></b-progress>
                </b-card-text>
                <b-button
                    ref="cancel"
                    variant="outline-danger"
                    size="sm"
                    aria-describedby="cancel-label"
                    @click="cancelProgress()"
                >
                    Cancel
                </b-button>
                <template #footer>
                    <em>
                        <b-badge>Speed: {{ progressData.download_rate }}</b-badge>
                        <b-badge>Downloaded: {{ progressData.download_done }}/{{ progressData.download_size }}</b-badge>
                    </em>
                </template>
            </b-card>            
            <b-row v-if="isLoadingNewTask">
                <b-col>
                    <b-icon icon="three-dots" font-scale="3" animation="cylon"></b-icon>
                </b-col>
            </b-row>
            <b-row v-if="isInQueue">
                <b-col>
                    <b-badge>In queue for {{ queueAction }}</b-badge>
                </b-col>
                <b-col>
                    <b-button
                        ref="cancel"
                        variant="outline-danger"
                        size="sm"
                        aria-describedby="cancel-label"
                        @click="cancelQueue()"
                    >
                        Cancel
                    </b-button>
                </b-col>
            </b-row>
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
            progressMax: 100,
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.enableInstalledReceiver();
        });
    },
    methods: {
        ...mapActions(['addToQueue']),
        enableInstalledReceiver() {
            window.ipcRenderer.receive(`response:check:app:installed:${this.currentApp.ident}`, (e, fileExists) => {
                if (fileExists) {
                    this.isInstalled = true;
                } else {
                    this.isInstalled = false;
                }
            });
        },
        checkInstalled() {
            const pathBaseDir = '/.aptstore/reports/installed/';
            let pathPlatform = `${this.selectedPlatform}/`;
            if (this.selectedPlatform == 'proton') {
                pathPlatform = 'steam/';
            }
            const installedDir = pathBaseDir + pathPlatform;
            const appToCheck = {installedDir: installedDir, appIdent: this.currentApp.ident};
            window.ipcRenderer.send('check:app:installed', appToCheck);
        },
        installApp() {
            const queueElement = {
                action: 'install',
                platform: this.selectedPlatform,
                ident: this.currentApp.ident,
                name: this.currentApp.name,
                login: 'someUser',
                secret: 'somePassword'
            };
            this.addToQueue(queueElement);
        },
        removeApp() {
            const queueElement = {
                action: 'remove',
                platform: this.selectedPlatform,
                ident: this.currentApp.ident,
                name: this.currentApp.name,
                login: 'someUser',
                secret: 'somePassword'
            };
            this.addToQueue(queueElement);
        },
        launchApp() {
            alert('Launching app not yet implemented');
        },
        cancelQueue() {
            alert('cancel queue not yet implemented');
        },
        cancelProgress() {
            alert('cancel progress not yet implemented');
        },
    },
    computed: {
        isLoadingNewTask() {
            return this.$store.state.queue_app_actions.is_loading_new_task;
        },
        isInQueue() {
            const newQueue = this.$store.state.queue_app_actions.queue;
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
            const newProgress = this.$store.state.queue_app_actions.current_progress;
            let inProgress = false;
            
            if (typeof newProgress == 'object' && newProgress.length > 0) {
                newProgress.every((currentProgress) => {
                    const currentProgressString = currentProgress.toString();
                    if (currentProgressString == '') {
                        return false;
                    }
                    const currentProgressJson = JSON.parse(currentProgressString);
                    if (currentProgressJson.app_ident === this.currentApp.ident) {
                        inProgress = true;
                    }
                });
            }

            if (inProgress) {
                return true;
            }

            this.checkInstalled();
            return false;
        },
        progressData() {
            const progressData = this.$store.state.queue_app_actions.current_progress;
            if (typeof progressData == 'object') {
                const progressDataJson = JSON.parse(progressData.toString());
                return progressDataJson;
            }
            return {};
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
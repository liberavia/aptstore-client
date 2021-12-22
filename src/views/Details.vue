<template>
    <main role="main" class="container fadeIn4">
        <div class="row">
            <div class="col-sm-6">
                <b-card bg-variant="dark" text-variant="white">                
                    <div id="app_details_mainicon_box">
                        <img id="app_details_mainicon" :src="currentApp.image_details">
                    </div>
                </b-card>
            </div>
            <div class="col-sm-6">
                <b-card bg-variant="dark" text-variant="white">                
                    <div class="row align-items-start">
                        <div class="col align-self-end">
                            <h1>{{ currentApp.name }}</h1>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 align-self-start">
                            <span 
                                v-for="category in currentApp.categories"
                                :key="category"
                                class="badge rounded-pill bg-primary"
                            >{{ category }}</span>
                        </div>
                        <div class="col-sm-4 align-self-end">
                            <b-form-rating 
                                v-model="avg_rating" 
                                variant="warning" 
                                no-border
                                readonly>
                            </b-form-rating>                        
                        </div>
                    </div>
                    <div v-if="currentApp.required_age_usk" class="row">
                        <div id="age_recommendation" class="col align-self-end">
                            <img id="usk" class="usk_default" :src="getUskImage(currentApp.required_age_usk)">
                        </div>
                    </div>
                    <div class="row align-items-end">
                        <div class="col align-self-end">
                            <div class="row">
                                <div class="col">
                                    <select class="form-select">
                                        <option
                                            v-for="platform in currentApp.platforms"
                                            :key="platform"
                                        >{{ platform }}</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <b-button variant="success">Install</b-button>
                                    <b-button variant="danger">Remove</b-button>
                                    <b-button variant="warning">Launch</b-button>                                
                                </div>
                            </div>
                        </div>
                    </div>
                </b-card>
            </div>
        </div>
        <div class="row">
            <b-card bg-variant="dark" text-variant="white">
                <b-card-text>{{ currentApp.description_short }}</b-card-text>
            </b-card>            
        </div>
        <div v-if="currentApp.screenshots.length > 0" class="row">
            <b-container bg-variant="dark" text-variant="white">
                <b-carousel
                    id="app-screenshots"
                    v-model="slide"
                    :interval="4000"
                    controls
                    indicators
                    fade
                    background="#333333"
                    label-next=""
                    label-prev=""
                    style="text-shadow: 1px 1px 2px #333;"
                >
                    <b-carousel-slide 
                        v-for="screenshot in currentApp.screenshots"
                        :key="screenshot.id"
                        :img-src="screenshot.image"
                    ></b-carousel-slide>
                </b-carousel>
            </b-container>            
        </div>
        <div class="row">
            <b-card bg-variant="dark" text-variant="white">
                <b-card-text>{{ currentApp.description_long }}</b-card-text>
            </b-card>            
        </div>
    </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Details',
    computed: mapGetters(['currentApp']),
    data() {
        return {
            avg_rating: 3.5,
            slide: 0,
        }
    },
    methods: {
        ...mapActions(['fetchApp']),
        getUskImage(age) {
            return `https://usk.de/wp-content/themes/neve-child/images/Assets/Icon/USK/${age}j.png`;
        }
    },
    created() {
        this.fetchApp(this.$route.params.id);
    }

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
<template>
    <main role="main" class="container fadeIn4">
        <div class="row">
            <div class="col-sm-6">
                <div id="app_details_mainicon_box">
                    <img id="app_details_mainicon" :src="currentApp.image_details">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="row align-items-start">
                    <div class="col align-self-end">
                        <h1>{{ currentApp.name }}</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6 align-self-start">
                        <b-badge 
                            v-for="category in currentApp.categories"
                            :key="category"
                            pill 
                            variant="primary"
                        >{{ category }}</b-badge>
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
                                <b-button variant="dark">Launch</b-button>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <h5>{{ currentApp.description_short }}</h5>
        </div>
        <div v-if="currentApp.screenshots.length > 0" class="row">
            <b-carousel
                id="app-screenshots"
                v-model="slide"
                :interval="4000"
                controls
                indicators
                fade
                background="#333333"
                img-width="1024"
                img-height="200"
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
        </div>
        <div class="row">
            <h6>{{ currentApp.description_long }}</h6>
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
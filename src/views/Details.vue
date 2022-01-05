<template>
    <b-container class="fadeIn4">
        <b-row>
            <b-col>
                <b-card-group>
                    <b-card bg-variant="dark" text-variant="white">
                        <b-card-img 
                            :src="currentApp.image_details"
                            width="95%"
                        >                
                    </b-card>
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
                            <DetailsActions 
                                :currentApp="currentApp" 
                                :selectedPlatform="currentApp.platforms[0]"
                            />
                        </div>
                    </b-card>
                </b-card-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-card bg-variant="dark" text-variant="white">
                    <b-card-text>{{ currentApp.description_short }}</b-card-text>
                </b-card>            
            </b-col>
        </b-row>
        <b-row v-if="currentApp.screenshots.length > 0">
            <b-col>
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
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-card bg-variant="dark" text-variant="white">
                    <b-card-text>{{ currentApp.description_long }}</b-card-text>
                </b-card>            
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import DetailsActions from '../components/DetailsActions.vue';

    export default {
        name: 'Details',
        components: {
            DetailsActions
        },
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
        },
        mounted() {
            document.title = 'Aptstore';
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
    .card img {
        width: 100% !important;
        height: 15vw !important;
        max-width: none !important;
        max-height: none !important;
        object-fit: cover !important;
    }
</style>
<template>
    <div>
        <div class="row">
            <h1>Featured Apps</h1>
        </div>
        <div id="appcards" class="row fadeIn4">
            <div 
                v-for="app in getFeaturedApps"
                :key="app.id"
                class="card" 
                style="width: 19rem;"
                @click="goToDetails(app.id)"
            >
                <div class="hvr-grow mx-auto">
                    <a href="#">
                        <img :src="app.image_thumb" class="img-responsive card-img-top w-100" :alt="app.name">
                    </a>
                </div>
                <div class="card-body">
                </div>
                <div class="card-footer">
                    <a href="#"><h5 class="card-title">{{ app.name }}</h5></a>
                    <p class="card-text"></p>
                </div>
            </div>            
        </div>        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'FeaturedApps',
    computed: mapGetters(['getFeaturedApps']),
    methods: {
        ...mapActions(['fetchFeaturedApps']),
        goToDetails(id) {
            this.$router.push(`details/${id}`);
        },
    },
    created() {
        this.fetchFeaturedApps();
    }
}
</script>

<style scoped>

</style>
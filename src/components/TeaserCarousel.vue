<template>
    <div>
        <b-carousel
            id="teaser-carousel"
            v-model="slide"
            :interval="4000"
            controls
            indicators
            background="#333333"
            img-width="1024"
            img-height="200"
            label-next=""
            label-prev=""
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
        >
            <b-carousel-slide 
                v-for="app in getTeaserApps"
                :key="app.id"
                :caption="app.name"
            >
                <template #img>
                    <img 
                        :src="app.image_banner"
                        style="cursor: pointer;"
                        @click="goToDetails(app.id)"
                    >
                </template>
            </b-carousel-slide>
        </b-carousel>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "TeaserCarousel",
    data() {
        return {
            slide: 0,
            sliding: null,
        }
    },
    computed: mapGetters(['getTeaserApps']),
    methods: {
        ...mapActions(['fetchTeaserApps']),
        onSlideStart() {
            this.sliding = true
        },
        onSlideEnd() {
            this.sliding = false
        },
        goToDetails(id) {
            this.$router.push(`details/${id}`);
        },
    },
    created() {
        this.fetchTeaserApps();
    }
}
</script>

<style scoped>
</style>

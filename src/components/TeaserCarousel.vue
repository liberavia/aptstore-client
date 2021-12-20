<template>
    <div>
        <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="4000"
            controls
            indicators
            background="#ababab"
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
                    :key="app.app_id"
                    :caption="app.title"
                    :img-src="app.banner_image"
                ></b-carousel-slide>
            </b-carousel>

            <p class="mt-4">
                Slide #: {{ slide }}<br>
                Sliding: {{ sliding }}
            </p>    
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "TeaserCarousel",
    data() {
        return {
            slide: 0,
            sliding: null
        }
    },
    computed: mapGetters(['getTeaserApps']),
    methods: {
        onSlideStart() {
            this.sliding = true
        },
        onSlideEnd() {
            this.sliding = false
        }
    },
}
</script>

<style scoped>
</style>

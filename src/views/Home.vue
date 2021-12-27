<template>
  <div class="home container">
    <TeaserCarousel />
    <FeaturedApps />
  </div>
</template>

<script>
import TeaserCarousel from '../components/TeaserCarousel.vue';
import FeaturedApps from '../components/FeaturedApps.vue';

export default {
  name: 'Home',
  components: {
    TeaserCarousel,
    FeaturedApps
  },
  mounted() {
    document.title = 'Aptstore - Home'
  },  
}
</script>

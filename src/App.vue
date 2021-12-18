<template>
  <div id="app" v-bind:style="{ backgroundColor: bcolor}">
    <MainNavigation />
    <router-view />
  </div>
</template>

<script>
import MainNavigation from './components/MainNavigation.vue'

export default {
  name: 'MainApp',
  created: function () {
    document.body.style.backgroundColor = this.bcolor;
  },
  destroyed: function () {
    document.body.style.backgroundColor = null;
  },  
  data() {
    return {
      bcolor: '#333333',
    };
  },
  components: {
    MainNavigation,
  }
}
</script>
<style>
</style>

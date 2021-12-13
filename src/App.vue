<template>
  <div id="app">
    <MainNavigation />
    <router-view />
  </div>
</template>

<script>
import MainNavigation from './components/MainNavigation.vue'

export default {
  name: 'MainApp',
  components: {
    MainNavigation,
  }
}
</script>
<style>
</style>

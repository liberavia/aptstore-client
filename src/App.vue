<template>
  <div id="app" v-bind:style="{ backgroundColor: bcolor}">
    <MainNavigation />
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import MainNavigation from './components/MainNavigation.vue'

export default {
  name: 'MainApp',
  created: function () {
    document.body.style.backgroundColor = this.bcolor;
  },
  mounted() {
    const pollingStarted = this.$store.state.queue_app_actions.polling_started;
    console.log(`Has polling already started? ${pollingStarted}`);
    if (!pollingStarted) {
      console.log(`Call polling vuex action startProgressPolling()`);
      this.startProgressPolling();
    }
  },
  destroyed: function () {
    document.body.style.backgroundColor = null;
    const pollingStarted = this.$store.state.queue_app_actions.polling_started;
    const intervalId = this.$store.state.interval_id;
    if (pollingStarted && intervalId) {
      this.stopProgressPolling();
    }
  },  
  data() {
    return {
      bcolor: '#333333',
    };
  },
  methods: {
      ...mapActions([
        'startProgressPolling',
        'stopProgressPolling'
      ]),  
  },
  components: {
    MainNavigation,
  }
}
</script>

<style>
.card {
    margin: 8px;
    background-color: #222;
}

h1, h2, h3, h4, h5, h6 {
  color: #fff;
  margin-top: 10px;
}

ul {
  margin: 0;
}

.bg-steel {
  background-color: #2c057a;
}

.content-section {
  background: #ffffff;
  padding: 10px 20px;
  border: 1px solid #dddddd;
  border-radius: 3px;
  margin-bottom: 20px;
}

.article-title {
  color: #444444;
}

a.article-title:hover {
  color: #428bca;
  text-decoration: none;
}

.article-content {
  white-space: pre-line;
}

.article-img {
  height: 65px;
  width: 65px;
  margin-right: 16px;
}

.article-metadata {
  padding-bottom: 1px;
  margin-bottom: 4px;
  border-bottom: 1px solid #e3e3e3
}

.article-metadata a:hover {
  color: #333;
  text-decoration: none;
}

.article-svg {
  width: 25px;
  height: 25px;
  vertical-align: middle;
}

.account-img {
  height: 125px;
  width: 125px;
  margin-right: 20px;
  margin-bottom: 16px;
}

.account-heading {
  font-size: 2.5rem;
}

.card img {
  max-height: 145px;
  width: auto !important;
  height: auto;
  max-width: 265px;
  text-align: center;
}

.bg-image {
  text-align: center;
}

/* Grow */
.hvr-grow {
    display: inline-block;
    vertical-align: middle;
    transform: translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    backface-visibility: hidden;
    -moz-osx-font-smoothing: grayscale;
    transition-duration: 0.3s;
    transition-property: transform;
}

.hvr-grow:hover,
.hvr-grow:focus,
.hvr-grow:active {
    transform: scale(1.1);
}

a {
    text-decoration: none;
}

@-webkit-keyframes fadein {
    from {
        opacity:0;
    }
    to {
        opacity:1;
    }
}

.fadeIn2 {
    animation: fadein 2s;
    -webkit-animation: fadein 2s;
}

.fadeIn3 {
    animation: fadein 3s;
    -webkit-animation: fadein 3s;
}

.fadeIn4 {
    animation: fadein 4s;
    -webkit-animation: fadein 4s;
}

.app_details_mainicon_box {
    width: 250px !important;
    height: auto;
}

.usk_default {
    height: 40px !important;
    margin-bottom: 10px;
    margin-top: 10px;
}

.form-control {
  background-color: #333 !important;
  color: white !important;
}
</style>

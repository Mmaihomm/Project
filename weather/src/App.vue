<template>
  <v-app>  
    <MyHeader />
    <Drawer v-bind:station="station"></Drawer>
    <google-map />
    <MyFooter />
    
  </v-app>
</template>

<script>
import GoogleMap from "./components/GoogleMap";
import MyHeader from "./components/Header";
import Drawer from "./components/NavDraw";
import MyFooter from "./components/Footer";


export default {
  name: "App",

  components: {
   GoogleMap,
   MyHeader,
   Drawer,
   MyFooter,
  },

  data() {
    return {
      station:'EW 214',
    };
  },
};
</script>

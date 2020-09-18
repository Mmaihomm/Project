<template>
  <v-app>  
    <MyHeader />
    <Drawer></Drawer>
    <google-map />
  </v-app>
</template>

<script>
import MyHeader from "./components/Header";
import Drawer from "./components/NavDraw";
import GoogleMap from "./components/GoogleMap";


export default {
  name: "App",

  components: {
    GoogleMap,
    MyHeader,
    Drawer,
  },

  data() {
    return {
      
    };
  },
};
</script>

<template>
  <v-app>  
    <MyHeader />
    <Drawer></Drawer>
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
      
    };
  },
};
</script>

<template>
  <v-app>
    <MyHeader />
    <Drawer></Drawer>
    <google-map />
  </v-app>
</template>

<script>
import GoogleMap from "./components/GoogleMap";
import MyHeader from "./components/Header";
import Drawer from "./components/NavDraw";

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

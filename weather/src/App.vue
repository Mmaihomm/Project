<template>
  <v-app>
    <MyHeader />
    <Drawer></Drawer>
  </v-app>
</template>

<script>
import MyHeader from "./components/Header";
import Drawer from "./components/NavDraw";

export default {
  name: "App",

  components: {
    MyHeader,
    Drawer,
  },

  data() {
    return {
      
    };
  },
};
</script>

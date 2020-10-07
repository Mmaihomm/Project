<template 
  absolute
>
  <v-card 
    absolute
    tile
    color = "red"
    height = 100%
  >
    
    <v-btn 
      icon
      v-if="!isSearch"
      background-color = "white"
      style="top: 8px; left: 8 px;"
      v-on:click="isSearch = true"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-toolbar
      class = "searching-tab"
      background-color = "white"
      absolute
      rounded
      dense
      style="top: 8px; left: 8 px;"
      v-if="isSearch"
    >
      <v-text-field
        hide-details
        floating
        single-line
        rounded
        background-color = "yellow"
      ></v-text-field>

      <v-btn 
        icon
        v-on:click="locatorButtonPressed()"
      >
        <v-icon>mdi-crosshairs-gps</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
  export default {
    name: "GoogleMap",

    data() {
      return {
        isSearch: false,
      };
    },


    methods: {
    locatorButtonPressed() {
      if(navigator.geolocation) {
        console.log("Hello You're in there");
        navigator.geolocation.getCurrentPosition(
          position => {
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
          }, 
          error => {
            console.log(error.message); 
          }
        );
      }
      else {
        console.log("Your browser does not support geolocation API");
      }
    }
  }
  };

</script>

<style scoped>

</style>